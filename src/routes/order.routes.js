const { Router } = require("express");
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isUserMiddleware = require("../middlewares/isUser.middleware");
const isCompanyMiddleware = require("../middlewares/isCompany.middleware");
const validate = require("../middlewares/validation.middleware");
const Yup = require("yup");

// Define validation schemas
const createOrderSchema = Yup.object().shape({
  order_type: Yup.string().oneOf(['product', 'wash', 'rental']).required(),
  items: Yup.array().of(
    Yup.object().shape({
      product_id: Yup.number().integer().positive().required(),
      quantity: Yup.number().integer().positive().required()
    })
  ),
  car_id: Yup.number().integer().positive(),
  wash_operations: Yup.array().of(Yup.number().integer().positive()),
  payment_method_id: Yup.number().integer().positive().required()
});

const orderStatusSchema = Yup.object().shape({
  status: Yup.string().oneOf(['pending', 'processing', 'completed', 'cancelled']).required(),
  notes: Yup.string()
});

const washOrderSchema = Yup.object().shape({
  car_id: Yup.number().integer().positive().required(),
  wash_operations: Yup.array().of(Yup.number().integer().positive()).required()
});

const rentalOrderSchema = Yup.object().shape({
  car_id: Yup.number().integer().positive().required(),
  start_date: Yup.date().required(),
  end_date: Yup.date().required().min(
    Yup.ref('start_date'),
    'End date must be after start date'
  )
});

const paginationSchema = Yup.object().shape({
  page: Yup.number().integer().min(1),
  limit: Yup.number().integer().min(1).max(100)
});

const orderIdParamSchema = Yup.object().shape({
  orderId: Yup.number().integer().positive().required()
});

const orderRoutes = Router();

// Orders - removing /api prefix since it's added globally
orderRoutes.post(
  "/orders", 
  authMiddleware, 
  isUserMiddleware, 
  validate(createOrderSchema),
  orderController.createOrder
);

orderRoutes.get(
  "/orders", 
  authMiddleware,
  validate(paginationSchema, 'query'),
  orderController.getOrders
);

orderRoutes.get(
  "/orders/:orderId", 
  authMiddleware,
  validate(orderIdParamSchema, 'params'),
  orderController.getOrder
);

orderRoutes.put(
  "/orders/:orderId/status", 
  authMiddleware, 
  validate({
    body: orderStatusSchema,
    params: orderIdParamSchema
  }),
  orderController.updateOrderStatus
);

// Specialty orders
orderRoutes.post(
  "/orders/:orderId/wash", 
  authMiddleware, 
  validate({
    body: washOrderSchema,
    params: orderIdParamSchema
  }),
  orderController.createWashOrder
);

orderRoutes.post(
  "/orders/:orderId/rental", 
  authMiddleware, 
  isUserMiddleware, 
  validate({
    body: rentalOrderSchema,
    params: orderIdParamSchema
  }),
  orderController.createRentalOrder
);

module.exports = orderRoutes;
