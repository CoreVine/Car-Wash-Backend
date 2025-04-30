const { Router } = require("express");
const carController = require("../controllers/car.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isCompanyMiddleware = require("../middlewares/isCompany.middleware");
const validate = require("../middlewares/validation.middleware");
const Yup = require("yup");
const multer = require("multer");

// Define validation schemas
const carSchema = Yup.object().shape({
  model: Yup.string().required(),
  year: Yup.number().integer().required(),
  price: Yup.number().positive().required(),
  exhibition_id: Yup.number().integer().required()
});

const carUpdateSchema = Yup.object().shape({
  model: Yup.string(),
  year: Yup.number().integer(),
  price: Yup.number().positive(),
  exhibition_id: Yup.number().integer()
});

const exhibitionSchema = Yup.object().shape({
  location: Yup.string().required()
});

const exhibitionUpdateSchema = Yup.object().shape({
  location: Yup.string().required()
});

const carFilterSchema = Yup.object().shape({
  page: Yup.number().integer().min(1),
  limit: Yup.number().integer().min(1).max(100),
  company_id: Yup.number().integer().positive(),
  exhibition_id: Yup.number().integer().positive(),
  min_price: Yup.number().positive(),
  max_price: Yup.number().positive().when('min_price', (min_price, schema) => 
    min_price ? schema.min(min_price) : schema
  ),
  min_year: Yup.number().integer(),
  max_year: Yup.number().integer().when('min_year', (min_year, schema) => 
    min_year ? schema.min(min_year) : schema
  ),
  search: Yup.string(),
  available_from: Yup.date(),
  // available_to: Yup.date().when('available_from', (available_from, schema) => 
  //   available_from ? schema.min(available_from) : schema
  // )
});

const exhibitionFilterSchema = Yup.object().shape({
  page: Yup.number().integer().min(1),
  limit: Yup.number().integer().min(1).max(100),
  company_id: Yup.number().integer().positive(),
  search: Yup.string(),
  location: Yup.string()
});

const carIdParamSchema = Yup.object().shape({
  carId: Yup.number().integer().positive().required()
});

const imageIdParamSchema = Yup.object().shape({
  imageId: Yup.number().integer().positive().required()
});

const companyIdParamSchema = Yup.object().shape({
  companyId: Yup.number().integer().positive().required()
});

const exhibitionIdParamSchema = Yup.object().shape({
  exhibitionId: Yup.number().integer().positive().required()
});

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const carRoutes = Router();

// Cars - removing /api prefix since it's added globally
carRoutes.post(
  "/cars", 
  authMiddleware, 
  isCompanyMiddleware, 
  validate(carSchema),
  carController.addCar
);

carRoutes.get(
  "/cars",
  validate(carFilterSchema, 'query'),
  carController.getCars
);

carRoutes.get(
  "/cars/:carId",
  validate(carIdParamSchema, 'params'),
  carController.getCar
);

carRoutes.put(
  "/cars/:carId", 
  authMiddleware, 
  isCompanyMiddleware, 
  validate({
    body: carUpdateSchema,
    params: carIdParamSchema
  }),
  carController.updateCar
);

carRoutes.delete(
  "/cars/:carId", 
  authMiddleware, 
  isCompanyMiddleware,
  validate(carIdParamSchema, 'params'),
  carController.deleteCar
);

// Car images
carRoutes.post(
  "/cars/:carId/images", 
  authMiddleware, 
  isCompanyMiddleware,
  validate(carIdParamSchema, 'params'),
  upload.single('image'), 
  carController.addCarImage
);

carRoutes.delete(
  "/cars/:carId/images/:imageId", 
  authMiddleware, 
  isCompanyMiddleware,
  validate({
    params: {
      ...carIdParamSchema.fields,
      ...imageIdParamSchema.fields
    }
  }),
  carController.deleteCarImage
);

// Exhibitions
carRoutes.post(
  "/exhibitions", 
  authMiddleware, 
  isCompanyMiddleware, 
  validate(exhibitionSchema),
  carController.addExhibition
);

carRoutes.get(
  "/exhibitions", 
  validate(exhibitionFilterSchema, 'query'),
  carController.getExhibitions
);

carRoutes.get(
  "/exhibitions/:exhibitionId",
  validate(exhibitionIdParamSchema, 'params'),
  carController.getExhibitionDetails
);

carRoutes.get(
  "/companies/:companyId/exhibitions",
  validate(companyIdParamSchema, 'params'),
  carController.getCompanyExhibitions
);

carRoutes.put(
  "/exhibitions/:exhibitionId",
  authMiddleware,
  isCompanyMiddleware,
  validate({
    body: exhibitionUpdateSchema,
    params: exhibitionIdParamSchema
  }),
  carController.updateExhibition
);

carRoutes.delete(
  "/exhibitions/:exhibitionId",
  authMiddleware,
  isCompanyMiddleware,
  validate(exhibitionIdParamSchema, 'params'),
  carController.deleteExhibition
);

module.exports = carRoutes;
