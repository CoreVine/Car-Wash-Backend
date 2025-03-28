const { Router } = require('express');
const router = Router();
const Yup = require('yup');
const adController = require('../controllers/ad.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");
const validate = require("../middlewares/validation.middleware");
const multerErrorHandler = require('../middlewares/multerErrorHandler.middleware');
const { createUploader } = require('../config/multer.config');

const adCreateSchema = Yup.object().shape({
  name: Yup.string().required().min(3).max(255)
});

const adUpdateSchema = Yup.object().shape({
  name: Yup.string().min(3).max(255)
});

const adIdParamSchema = Yup.object().shape({
  adId: Yup.number().integer().positive().required()
});



// Configure multer for ad image uploads
const uploader = createUploader({
  storageType: process.env.STORAGE_TYPE || 'disk',
  uploadPath: 'uploads/ads',
  fileFilter: 'images',
  fileSize: 5 * 1024 * 1024, // 5MB
  fileNamePrefix: 'ad'
});

// Handle file upload errors
const handleFileUpload = (req, res, next) => {
  uploader.single('image')(req, res, (err) => {
    if (err) {
      return multerErrorHandler(err, req, res, next);
    }
    next();
  });
};

// Routes that need S3 upload handling
const handleS3Upload = (req, res, next) => {
  if (process.env.STORAGE_TYPE === 's3') {
    uploader.single('image')[1](req, res, next);
  } else {
    next();
  }
};

// Create new ad
router.post(
  '/ads/',
  authMiddleware,
  isAdminMiddleware,
  handleFileUpload,
  handleS3Upload,
  validate(adCreateSchema),
  adController.createAd
);

// Get all ads with pagination
router.get('/ads/', adController.getAllAds);

// Get a specific ad
router.get(
  '/ads/:adId',
  validate(adIdParamSchema, 'params'),
  adController.getAd
);

// Update an ad
router.put(
  '/ads/:adId',
  authMiddleware,
  isAdminMiddleware,
  handleFileUpload,
  handleS3Upload,
  validate(adIdParamSchema, 'params'),
  validate(adUpdateSchema),
  adController.updateAd
);

// Delete an ad
router.delete(
  '/ads/:adId',
  authMiddleware,
  isAdminMiddleware,
  validate(adIdParamSchema, 'params'),
  adController.deleteAd
);

module.exports = router;
