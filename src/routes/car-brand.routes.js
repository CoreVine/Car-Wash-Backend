const express = require("express");
const router = express.Router();
const carBrandController = require("../controllers/car-brand.controller");
const { createUploader } = require("../config/multer.config");
const authMiddleware = require("../middlewares/auth.middleware");
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");

// Create custom uploader for brand logos
const brandLogoUploader = createUploader({
  storageType: process.env.STORAGE_TYPE || "cloudinary",
  uploadPath: "uploads/brand-logos", // Store in the brand-logos folder
  fileFilter: "images", // Only allow image files
  fileSize: 2 * 1024 * 1024, // Limit to 2MB
  fileNamePrefix: "brand",
});

// Public routes
router.get("/brands/", carBrandController.getAllBrands);
router.get("/brands/:brandId", carBrandController.getBrandById);
router.get("/brands/:brandId/cars", carBrandController.getBrandWithCars);

// Protected routes (admin only)
router.post(
  "/brands/",
  // authMiddleware,
  // isAdminMiddleware,
  ...brandLogoUploader.single("logo"),
  carBrandController.createBrand
);
router.put(
  "/brands/:brandId",
  authMiddleware,
  isAdminMiddleware,
  brandLogoUploader.single("logo"),
  carBrandController.updateBrand
);
router.delete(
  "/brands/:brandId",
  authMiddleware,
  isAdminMiddleware,
  carBrandController.deleteBrand
);

module.exports = router;
