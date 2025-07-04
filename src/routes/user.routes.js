const { Router } = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");
const isSelfAuthorizedMiddleware = require("../middlewares/isSelfAuthorized.middleware");
const multerErrorHandler = require("../middlewares/multerErrorHandler.middleware");
const validate = require("../middlewares/validation.middleware");
const { createUploader } = require("../config/multer.config");
const { anyOf } = require("../utils/middleware.utils");
const Yup = require("yup");

const userRoutes = Router();

// Validation schemas
const userCreateSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required(),
  phone_number: Yup.string(),
  address: Yup.string(),
  profile_picture_url: Yup.string().nullable()
});

const userUpdateSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email(),
  phone_number: Yup.string(),
  address: Yup.string(),
  profile_picture_url: Yup.string().nullable(),
  oldPassword: Yup.string().min(8),
  password: Yup.string().min(8),
});

const userIdParamSchema = Yup.object().shape({
  userId: Yup.number().integer().positive().required()
});

const idParamSchema = Yup.object().shape({
  id: Yup.number().integer().positive().required()
});

const paginationQuerySchema = Yup.object().shape({
  page: Yup.number().integer().positive().default(1),
  limit: Yup.number().integer().positive().default(10)
});

// Create profile picture uploader with specific configuration
const profilePictureUploader = createUploader({
  storageType: 'disk', // or 's3' if you prefer AWS S3
  uploadPath: 'uploads/profile-pictures',
  fileFilter: 'images',
  fileSize: 5 * 1024 * 1024, // 5MB
  fileNamePrefix: 'profile'
});

// Routes for the old controller methods (now updated)
userRoutes.post(
  "/user", 
  authMiddleware, 
  isAdminMiddleware, 
  validate(userCreateSchema),
  userController.add
);

userRoutes.get(
  "/user", 
  authMiddleware, 
  isAdminMiddleware,
  userController.get
);

userRoutes.get(
  "/user/paginated", 
  authMiddleware, 
  isAdminMiddleware, 
  validate(paginationQuerySchema, 'query'),
  userController.getPaginated
);

userRoutes.get(
  "/user/:id", 
  authMiddleware, 
  validate(idParamSchema, 'params'),
  userController.find
);

userRoutes.put(
  "/user/:id", 
  authMiddleware, 
  validate({
    body: userUpdateSchema,
    params: idParamSchema
  }),
  userController.update
);

userRoutes.delete(
  "/user/:id", 
  authMiddleware, 
  anyOf(isSelfAuthorizedMiddleware, isAdminMiddleware),
  validate(idParamSchema, 'params'),
  userController.delete
);

// New API routes
userRoutes.get(
  "/users", 
  authMiddleware, 
  isAdminMiddleware, 
  userController.getAllUsers
);

userRoutes.get(
  "/users/:userId", 
  authMiddleware, 
  validate(userIdParamSchema, 'params'),
  userController.getUser
);

userRoutes.put(
  "/users/:userId", 
  authMiddleware, 
  validate({
    body: userUpdateSchema,
    params: userIdParamSchema
  }),
  userController.updateUser
);

// Updated profile picture routes with file upload
userRoutes.post(
  "/users/:userId/profile-picture", 
  authMiddleware, 
  validate(userIdParamSchema, 'params'),
  profilePictureUploader.single('profileImage'),
  multerErrorHandler,
  userController.uploadProfilePicture
);

userRoutes.put(
  "/users/:userId/profile-picture", 
  authMiddleware,
  validate(userIdParamSchema, 'params'),
  profilePictureUploader.single('profileImage'),
  multerErrorHandler,
  userController.updateProfilePicture
);

userRoutes.delete(
  "/users/:userId/profile-picture", 
  authMiddleware,
  validate(userIdParamSchema, 'params'),
  userController.deleteProfilePicture
);

module.exports = userRoutes;

