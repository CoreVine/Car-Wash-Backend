const { Router } = require("express");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isCompanyMiddleware = require("../middlewares/isCompany.middleware");
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");
const validate = require("../middlewares/validation.middleware");
const Yup = require("yup");
const multer = require("multer");

// Define validation schemas
const productSchema = Yup.object().shape({
  product_name: Yup.string().required(),
  description: Yup.string().required(),
  price: Yup.number().positive().required(),
  stock: Yup.number().integer().min(0).required(),
  sub_category_ids: Yup.array().of(Yup.number().integer().positive()).min(1).required()
});

const productUpdateSchema = Yup.object().shape({
  product_name: Yup.string(),
  description: Yup.string(),
  price: Yup.number().positive(),
  stock: Yup.number().integer().min(0),
  sub_category_ids: Yup.array().of(Yup.number().integer().positive())
});

const categorySchema = Yup.object().shape({
  category_name: Yup.string().required()
});

const subCategorySchema = Yup.object().shape({
  name: Yup.string().required()
});

const productFilterSchema = Yup.object().shape({
  page: Yup.number().integer().min(1),
  limit: Yup.number().integer().min(1).max(100),
  category_id: Yup.number().integer().positive(),
  company_id: Yup.number().integer().positive(),
  min_price: Yup.number().positive(),
  max_price: Yup.number().positive(),
  search: Yup.string()
});

const productIdParamSchema = Yup.object().shape({
  productId: Yup.number().integer().positive().required()
});

const categoryIdParamSchema = Yup.object().shape({
  categoryId: Yup.number().integer().positive().required()
});

const imageIdParamSchema = Yup.object().shape({
  imageId: Yup.number().integer().positive().required()
});

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const productRoutes = Router();

// Products - removing /api prefix since it's added globally
productRoutes.post("/products", 
  authMiddleware, 
  isCompanyMiddleware,
  validate(productSchema),
  productController.addProduct
);

productRoutes.get(
  "/products",
  validate(productFilterSchema, 'query'),
  productController.getProducts
);

productRoutes.get(
  "/products/:productId",
  validate(productIdParamSchema, 'params'),
  productController.getProduct
);

productRoutes.put(
  "/products/:productId", 
  authMiddleware,
  validate({
    body: productUpdateSchema,
    params: productIdParamSchema
  }),
  productController.updateProduct
);

productRoutes.delete(
  "/products/:productId", 
  authMiddleware,
  validate(productIdParamSchema, 'params'),
  productController.deleteProduct
);

// Product images
productRoutes.post(
  "/products/:productId/images", 
  authMiddleware,
  validate(productIdParamSchema, 'params'),
  upload.single('image'), 
  productController.addProductImage
);

productRoutes.delete(
  "/products/:productId/images/:imageId",
  authMiddleware,
  validate({
    params: {
      productId: Yup.number().integer().positive().required(),
      imageId: Yup.number().integer().positive().required()
    }
  }),
  productController.deleteProductImage
);

// Categories
productRoutes.get("/categories", productController.getCategories);

productRoutes.get(
  "/categories/:categoryId/subcategories",
  validate(categoryIdParamSchema, 'params'),
  productController.getSubCategories
);

productRoutes.post(
  "/categories", 
  authMiddleware, 
  isAdminMiddleware, 
  validate(categorySchema),
  productController.addCategory
);

productRoutes.post(
  "/categories/:categoryId/subcategories", 
  authMiddleware, 
  isAdminMiddleware,
  validate({
    body: subCategorySchema,
    params: categoryIdParamSchema
  }),
  productController.addSubCategory
);

module.exports = productRoutes;
