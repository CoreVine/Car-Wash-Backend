const { Router } = require("express");
const washTypeController = require("../controllers/washtype.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isCompanyMiddleware = require("../middlewares/isCompany.middleware");
const validate = require("../middlewares/validation.middleware");
const Yup = require("yup");

// Define validation schemas
const createWashTypeSchema = Yup.object().shape({
  name: Yup.string().required('Wash type name is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  description: Yup.string()
});

const updateWashTypeSchema = Yup.object().shape({
  name: Yup.string(),
  price: Yup.number().positive('Price must be positive'),
  description: Yup.string()
}).test(
  'at-least-one-field',
  'At least one field must be provided',
  value => !!value.name || !!value.price || !!value.description
);

const paginationSchema = Yup.object().shape({
  page: Yup.number().integer().min(1),
  limit: Yup.number().integer().min(1).max(100),
  min_price: Yup.number().integer().min(0),
  max_price: Yup.number().integer().min(0)
});

const washTypeRoutes = Router();

// Public routes
washTypeRoutes.get(
  "/wash-types",
  validate(paginationSchema, 'query'),
  washTypeController.getAllWashTypes
);

washTypeRoutes.get(
  "/companies/:companyId/wash-types",
  validate(paginationSchema, 'query'),
  washTypeController.getCompanyWashTypes
);

washTypeRoutes.get(
  "/wash-types/popular",
  washTypeController.getPopularWashTypes
);

// Company only routes
washTypeRoutes.post(
  "/wash-types",
  authMiddleware,
  isCompanyMiddleware,
  validate(createWashTypeSchema),
  washTypeController.addWashType
);

washTypeRoutes.put(
  "/wash-types/:typeId",
  authMiddleware,
  isCompanyMiddleware,
  validate(updateWashTypeSchema),
  washTypeController.updateWashType
);

washTypeRoutes.delete(
  "/wash-types/:typeId",
  authMiddleware,
  isCompanyMiddleware,
  washTypeController.deleteWashType
);

module.exports = washTypeRoutes;
