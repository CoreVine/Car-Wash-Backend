const { Router } = require("express");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isCompanyMiddleware = require("../middlewares/isCompany.middleware");
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");
const validate = require("../middlewares/validation.middleware");
const Yup = require("yup");
const {
  createUploader,
  requireFileUpload,
} = require("../config/multer.config");

// Define validation schemas
const productSchema = Yup.object().shape({
  product_name: Yup.string().required(),
  description: Yup.string().required(),
  price: Yup.number().positive().required(),
  stock: Yup.number().integer().min(0).required(),
  sub_category_ids: Yup.array()
    .of(Yup.number().integer().positive())
    .min(1)
    .required(),
});

const productUpdateSchema = Yup.object().shape({
  product_name: Yup.string(),
  description: Yup.string(),
  price: Yup.number().positive(),
  stock: Yup.number().integer().min(0),
  sub_category_ids: Yup.array().of(Yup.number().integer().positive()),
});

const categorySchema = Yup.object().shape({
  category_name: Yup.string().required(),
});

const categoryUpdateSchema = Yup.object().shape({
  category_name: Yup.string(),
});

const subCategorySchema = Yup.object().shape({
  name: Yup.string().required(),
});

const subCategoryUpdateSchema = Yup.object().shape({
  name: Yup.string(),
});

const productFilterSchema = Yup.object().shape({
  page: Yup.number().integer().min(1),
  limit: Yup.number().integer().min(1).max(100),
  category_id: Yup.number().integer().positive(),
  company_id: Yup.number().integer().positive(),
  min_price: Yup.number().positive(),
  max_price: Yup.number().positive(),
  search: Yup.string(),
});

const productIdParamSchema = Yup.object().shape({
  productId: Yup.number().integer().positive().required(),
});

const categoryIdParamSchema = Yup.object().shape({
  categoryId: Yup.number().integer().positive().required(),
});

// Configure uploaders
const productImageUploader = createUploader({
  storageType: process.env.STORAGE_TYPE || "cloudinary",
  uploadPath: "uploads/product-images",
  fileFilter: "images",
  fileSize: 5 * 1024 * 1024, // 5MB limit
});

const categoryIconUploader = createUploader({
  storageType: process.env.STORAGE_TYPE || "cloudinary",
  uploadPath: "uploads/category-icons",
  fileFilter: "images",
  fileSize: 2 * 1024 * 1024, // 2MB limit
});

const subCategoryIconUploader = createUploader({
  storageType: process.env.STORAGE_TYPE || "cloudinary",
  uploadPath: "uploads/subcategory-icons",
  fileFilter: "images",
  fileSize: 2 * 1024 * 1024, // 2MB limit
});

const productRoutes = Router();

// Products - removing /api prefix since it's added globally
productRoutes.post(
  "/products",
  authMiddleware,
  isAdminMiddleware,
  ...(Array.isArray(productImageUploader.array("images", 5))
    ? productImageUploader.array("images", 5)
    : [productImageUploader.array("images", 5)]),
  validate(productSchema),
  productController.addProduct
);

productRoutes.get(
  "/products",
  validate(productFilterSchema, "query"),
  productController.getProducts
);

productRoutes.get(
  "/products/:productId",
  validate(productIdParamSchema, "params"),
  productController.getProduct
);

productRoutes.put(
  "/products/:productId",
  authMiddleware,
  validate({
    body: productUpdateSchema,
    params: productIdParamSchema,
  }),
  productController.updateProduct
);

productRoutes.delete(
  "/products/:productId",
  authMiddleware,
  isAdminMiddleware,
  validate(productIdParamSchema, "params"),
  productController.deleteProduct
);

// Product images
productRoutes.post(
  "/products/:productId/images",
  authMiddleware,
  isAdminMiddleware,
  ...(Array.isArray(productImageUploader.single("image"))
  ? productImageUploader.single("image")
  : [productImageUploader.single("image")]),
  requireFileUpload("image"),
  validate(productIdParamSchema, "params"),
  productController.addProductImage
);

productRoutes.delete(
  "/products/:productId/images/:imageId",
  authMiddleware,
  validate({
    params: {
      productId: Yup.number().integer().positive().required(),
      imageId: Yup.number().integer().positive().required(),
    },
  }),
  isAdminMiddleware,
  productController.deleteProductImage
);

// Categories
productRoutes.get("/categories", productController.getCategories);

productRoutes.post(
  "/categories",
  authMiddleware,
  isAdminMiddleware,
  ...categoryIconUploader.single("icon"),
  requireFileUpload("icon"),
  validate(categorySchema),
  // requireFileUpload("Category icon"),
  productController.addCategory
);

productRoutes.put(
  "/categories/:categoryId",
  authMiddleware,
  isAdminMiddleware,
  categoryIconUploader.single("icon"),
  validate({
    body: categoryUpdateSchema,
    params: categoryIdParamSchema,
  }),
  productController.updateCategory
);

productRoutes.delete(
  "/categories/:categoryId",
  authMiddleware,
  isAdminMiddleware,
  validate(categoryIdParamSchema, "params"),
  productController.deleteCategory
);

// Subcategories
productRoutes.get(
  "/categories/:categoryId/subcategories",
  validate(categoryIdParamSchema, "params"),
  productController.getSubCategories
);

productRoutes.post(
  "/categories/:categoryId/subcategories",
  authMiddleware,
  isAdminMiddleware,
  ...subCategoryIconUploader.single("icon"),
  requireFileUpload("icon"),
  // (req, res) => {
  //   console.log(req.file);

  //   return res.json(req.file);
  // },
  validate({
    body: subCategorySchema,
    params: categoryIdParamSchema,
  }),
  productController.addSubCategory
);

productRoutes.put(
  "/categories/:categoryId/subcategories/:subCategoryId",
  authMiddleware,
  isAdminMiddleware,
  subCategoryIconUploader.single("icon"),
  validate({
    body: subCategoryUpdateSchema,
    params: {
      categoryId: Yup.number().integer().positive().required(),
      subCategoryId: Yup.number().integer().positive().required(),
    },
  }),
  productController.updateSubCategory
);

productRoutes.delete(
  "/categories/:categoryId/subcategories/:subCategoryId",
  authMiddleware,
  isAdminMiddleware,
  validate({
    params: {
      categoryId: Yup.number().integer().positive().required(),
      subCategoryId: Yup.number().integer().positive().required(),
    },
  }),
  productController.deleteSubCategory
);

module.exports = productRoutes;
