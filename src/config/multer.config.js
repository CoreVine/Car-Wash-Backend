const multer = require("multer");
const path = require("path");
const fs = require("fs");
const awsService = require("../services/aws.service");
const os = require("os");
const { v4: uuidv4 } = require("uuid"); // Correct import for v4 UUID
const loggingService = require("../services/logging.service");
const logger = loggingService.getLogger();

// Create a custom middleware to check for file upload
const requireFileUpload = (fieldName) => (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: `${fieldName} is required`,
      code: "BAD_REQUEST",
      data: null,
    });
  }
  next();
};

/**
 * Predefined file type filters
 */
const fileFilters = {
  // Filter for image files
  images: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
        ),
        false
      );
    }
  },
  // Filter for document files
  documents: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only PDF and DOC/DOCX are allowed."),
        false
      );
    }
  },
  // Filter for video files
  videos: (req, file, cb) => {
    const allowedTypes = [
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only MP4, MPEG, MOV, and AVI are allowed."
        ),
        false
      );
    }
  },
  // Allow all file types
  all: (req, file, cb) => {
    cb(null, true);
  },
};

/**
 * Ensure directory exists
 * @param {string} directory - Directory path
 */
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

/**
 * Create a custom file filter
 * @param {string[]} allowedMimeTypes - Array of allowed MIME types
 * @param {string} errorMessage - Error message for invalid files
 */
const createFileFilter = (allowedMimeTypes, errorMessage) => {
  return (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          errorMessage ||
            `Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`
        ),
        false
      );
    }
  };
};

/**
 * Delete file from storage
 * @param {string} filePath - File path or URL
 */
const deleteUploadedFile = async (filePath) => {
  if (!filePath) return;

  try {
    // Local storage
    if (filePath.startsWith("/uploads/") || filePath.startsWith("uploads/")) {
      const basePath = process.cwd();
      const fullPath = path.join(basePath, filePath);

      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        console.log(`File deleted successfully: ${fullPath}`);
      }
    }
    // AWS S3
    else if (filePath.includes(".amazonaws.com/")) {
      // Parse the URL to extract necessary information
      const url = new URL(filePath);
      const pathSegments = url.pathname.split("/").filter(Boolean);

      // Extract the filename and extension
      const filename = pathSegments[pathSegments.length - 1];
      const fileUUID = filename.split(".")[0];
      const extension = path.extname(filename).substring(1);

      // Extract the bucket path (folder structure)
      const bucketPath =
        pathSegments.length > 1
          ? pathSegments.slice(1, -1).join("/") + "/"
          : "";

      await awsService.deleteFile(fileUUID, extension, bucketPath);
      console.log(`File deleted from S3: ${filename}`);
    }
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
  }
};

/**
 * Create multer configuration
 * @param {Object} options - Configuration options
 * @param {string} options.storageType - Storage type ('disk' or 's3')
 * @param {string} options.uploadPath - Upload path for disk storage or bucket path for S3
 * @param {string|function} options.fileFilter - Predefined filter name or custom filter function
 * @param {number} options.fileSize - Maximum file size in bytes
 * @param {Object} options.limits - Additional limits for multer
 * @param {string} options.fileNamePrefix - Prefix for uploaded files
 */
function createUploader(options = {}) {
  const {
    storageType = "disk",
    uploadPath = "uploads",
    fileFilter = "all",
    fileSize = 5 * 1024 * 1024, // 5MB default
    limits = {},
    fileNamePrefix = "",
  } = options;

  // Resolve file filter
  const resolvedFilter =
    typeof fileFilter === "function"
      ? fileFilter
      : fileFilters[fileFilter] || fileFilters.all;

  // Configure common limits
  const uploadLimits = {
    fileSize,
    ...limits,
  };

  // Disk Storage Configuration
  if (storageType === "disk") {
    const uploadDir = path.join(process.cwd(), uploadPath);
    ensureDirectoryExists(uploadDir);

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const prefix = fileNamePrefix ? `${fileNamePrefix}-` : "";
        cb(null, `${prefix}${uniqueSuffix}${ext}`);
      },
    });

    return multer({
      storage,
      fileFilter: resolvedFilter,
      limits: uploadLimits,
    });
  }

  // S3 Storage Configuration
  else if (storageType === "s3") {
    const bucketPath = uploadPath.endsWith("/") ? uploadPath : `${uploadPath}/`;
    const tempDir = path.join(os.tmpdir(), "express-app-uploads");
    ensureDirectoryExists(tempDir);

    // For AWS S3, we first need to save to disk since aws.service.js expects files on disk
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, tempDir);
      },
      filename: (req, file, cb) => {
        // Generate a UUID for the file
        const uuid = uuidv4(); // Use uuidv4() from the import
        const ext = path.extname(file.originalname);
        // Save the UUID to use later for S3 upload
        file.uuid = uuid;
        cb(null, `${uuid}${ext}`); // Filename in temp directory will be uuid.ext
      },
    });

    const multerInstance = multer({
      storage,
      fileFilter: resolvedFilter,
      limits: uploadLimits,
    });

    // Create wrapper functions that combine multer with S3 upload
    const uploadToS3 = async (req, res, next) => {
      try {
        // Handle single file uploads
        if (req.file) {
          const file = req.file;
          const ext = path.extname(file.originalname).substring(1);

          // IMPORTANT: Perform the actual S3 upload using file.path and file.uuid
          // Assuming awsService.uploadFile expects (filePath, extension, bucketPath, uuid_for_s3_key)
          // Adjust awsService.uploadFile signature if needed in aws.service.js
          const s3KeyUuid = file.uuid; // Use the UUID generated during disk storage
          // await awsService.uploadFile(file.path, ext, bucketPath, s3KeyUuid);

          // Update req.file with S3 info
          file.url = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${bucketPath}${s3KeyUuid}.${ext}`;
          file.key = `${bucketPath}${s3KeyUuid}.${ext}`;
          // file.uuid is already set, no need to re-assign unless you want to confirm
        }

        // Handle multiple file uploads
        if (req.files) {
          // Handle array of files (e.g., upload.array('photos'))
          if (Array.isArray(req.files)) {
            const uploadPromises = req.files.map(async (file) => {
              const ext = path.extname(file.originalname).substring(1);
              const s3KeyUuid = file.uuid; // Use the UUID generated during disk storage
              await awsService.uploadFile(
                file.path,
                ext,
                bucketPath,
                s3KeyUuid
              );

              file.url = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${bucketPath}${s3KeyUuid}.${ext}`;
              file.key = `${bucketPath}${s3KeyUuid}.${ext}`;
              return file;
            });

            req.files = await Promise.all(uploadPromises);
          }
          // Handle fields of files (e.g., upload.fields([{ name: 'avatar' }, { name: 'gallery' }]))
          else {
            for (const field in req.files) {
              const files = req.files[field];
              const uploadPromises = files.map(async (file) => {
                const ext = path.extname(file.originalname).substring(1);
                const s3KeyUuid = file.uuid; // Use the UUID generated during disk storage
                await awsService.uploadFile(
                  file.path,
                  ext,
                  bucketPath,
                  s3KeyUuid
                );

                file.url = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${bucketPath}${s3KeyUuid}.${ext}`;
                file.key = `${bucketPath}${s3KeyUuid}.${ext}`;
                return file;
              });

              req.files[field] = await Promise.all(uploadPromises);
            }
          }
        }

        next();
      } catch (error) {
        logger.error(`Error during S3 upload process: ${error.message}`, error); // Log the error

        // Clean up temporary files in case of error
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, (err) => {
            if (err)
              logger.error(`Error cleaning up temp file after error: ${err}`);
          });
        }
        if (req.files) {
          // Clean up array of files
          if (Array.isArray(req.files)) {
            req.files.forEach((file) => {
              if (file.path) {
                fs.unlink(file.path, (err) => {
                  if (err)
                    logger.error(
                      `Error cleaning up temp file after error: ${err}`
                    );
                });
              }
            });
          }
          // Clean up fields of files
          else {
            Object.values(req.files)
              .flat()
              .forEach((file) => {
                if (file.path) {
                  fs.unlink(file.path, (err) => {
                    if (err)
                      logger.error(
                        `Error cleaning up temp file after error: ${err}`
                      );
                  });
                }
              });
          }
        }
        next(error); // Pass the error to the next error handling middleware
      }
    };

    // Return wrapped methods
    return {
      single: (fieldName) => [multerInstance.single(fieldName), uploadToS3],
      array: (fieldName, maxCount) => [
        multerInstance.array(fieldName, maxCount),
        uploadToS3,
      ],
      fields: (fields) => [multerInstance.fields(fields), uploadToS3],
      any: () => [multerInstance.any(), uploadToS3],
      none: () => multerInstance.none(),
    };
  }

  throw new Error(`Unsupported storage type: ${storageType}`);
}

module.exports = {
  createUploader,
  fileFilters,
  createFileFilter,
  deleteUploadedFile,
  requireFileUpload,
};
