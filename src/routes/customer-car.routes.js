const { Router } = require("express");
const customerCarController = require("../controllers/customer-car.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isUserMiddleware = require("../middlewares/isUser.middleware");
const validate = require("../middlewares/validation.middleware");
const Yup = require("yup");

// Define validation schemas
const customerCarSchema = Yup.object().shape({
  model: Yup.string().required(),
  car_plate_number: Yup.string().required()
});

const customerCarUpdateSchema = Yup.object().shape({
  model: Yup.string(),
  car_plate_number: Yup.string()
});

const paginationSchema = Yup.object().shape({
  page: Yup.number().integer().min(1),
  limit: Yup.number().integer().min(1).max(100)
});

const carIdParamSchema = Yup.object().shape({
  carId: Yup.number().integer().positive().required()
});

const customerCarRoutes = Router();

// Removing /api prefix since it's added globally
customerCarRoutes.post(
  "/customer-cars", 
  authMiddleware, 
  isUserMiddleware, 
  validate(customerCarSchema),
  customerCarController.addCustomerCar
);

customerCarRoutes.get(
  "/customer-cars", 
  authMiddleware, 
  isUserMiddleware,
  validate(paginationSchema, 'query'),
  customerCarController.getCustomerCars
);

customerCarRoutes.get(
  "/customer-cars/:carId", 
  authMiddleware,
  validate(carIdParamSchema, 'params'),
  customerCarController.getCustomerCar
);

customerCarRoutes.put(
  "/customer-cars/:carId", 
  authMiddleware, 
  isUserMiddleware, 
  validate({
    body: customerCarUpdateSchema,
    params: carIdParamSchema
  }),
  customerCarController.updateCustomerCar
);

customerCarRoutes.delete(
  "/customer-cars/:carId", 
  authMiddleware, 
  isUserMiddleware,
  validate(carIdParamSchema, 'params'),
  customerCarController.deleteCustomerCar
);

module.exports = customerCarRoutes;
