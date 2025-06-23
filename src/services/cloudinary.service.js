// services/cloudinary.service.js
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const loggingService = require("./logging.service");
const logger = loggingService.getLogger();
const path = require("path"); // <-- Here it is

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a file to Cloudinary.
 * Can accept a local file path (string) or a Buffer.
 * @param {string | Buffer} fileData - The path to the file on the local disk OR the file Buffer.
 * @param {string} folder - The folder in Cloudinary to upload to.
 * @param {string} resourceType - 'image', 'video', or 'raw'.
 * @param {string} originalFilename - Required when uploading a Buffer, to infer file extension/type.
 * @returns {Promise<Object>} The Cloudinary upload result.
 */
async function uploadFile(
  fileData,
  folder = "uploads",
  resourceType = "auto",
  originalFilename = null
) {
  try {
    const options = {
      folder: folder,
      resource_type: resourceType,
      use_filename: true, // Use the original filename as public ID
      unique_filename: false, // Don't add a random string to the filename
      overwrite: true, // Overwrite if a file with the same public ID exists
    };

    // If fileData is a Buffer, adjust options to use originalFilename
    if (Buffer.isBuffer(fileData) && originalFilename) {
      // Cloudinary can often infer the type from the buffer itself or mimetype,
      // but passing original_filename can help with public_id and format.
      options.public_id = originalFilename.split(".").slice(0, -1).join("."); // Use original name as public_id base
      options.format = path.extname(originalFilename).substring(1); // Explicitly set format
    }

    logger.info(
      `Uploading file to Cloudinary to folder ${folder} as ${resourceType}`
    );
    // The core change: cloudinary.uploader.upload accepts Buffer directly as the first argument
    const result = await cloudinary.uploader.upload(fileData, options);
    logger.info(`Cloudinary upload successful: ${result.secure_url}`);
    return result;
  } catch (error) {
    logger.error(`Error uploading file to Cloudinary: ${error.message}`, error);
    throw error;
  }
}

// ... (deleteFile and getFileUrl remain the same)
async function deleteFile(publicId, resourceType = "image") {
  try {
    logger.info(`Deleting file from Cloudinary: ${publicId} (${resourceType})`);
    const urlWithoutVersion = extractPublicId(publicId);
    const result = await cloudinary.uploader.destroy(urlWithoutVersion, {
      resource_type: resourceType,
    });
    logger.info(
      `Cloudinary deletion successful for publicId: ${publicId}, result: ${JSON.stringify(
        result
      )}`
    );
    return result;
  } catch (error) {
    console.log(`Error deleting file from Cloudinary: ${error}`);
    logger.error(
      `Error deleting file from Cloudinary: ${error.message}`,
      error
    );
    throw error;
  }
}

function getFileUrl(publicId, options = {}, resourceType = "image") {
  return cloudinary.url(publicId, { ...options, resource_type: resourceType });
}
function extractPublicId(url) {
  try {
    const parts = url.split("/upload/");
    const pathWithVersion = parts[1]; // v123456789/folder/image-id.jpg
    const pathWithoutVersion = pathWithVersion.split("/").slice(1).join("/"); // remove version
    const withoutExtension = pathWithoutVersion.replace(/\.[^/.]+$/, ""); // remove .jpg, .png etc.
    return withoutExtension;
  } catch (err) {
    console.error("Invalid Cloudinary URL:", url);
    return null;
  }
}

module.exports = {
  uploadFile,
  deleteFile,
  getFileUrl,
};
