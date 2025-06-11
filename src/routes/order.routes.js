const { Router } = require("express");
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isUserMiddleware = require("../middlewares/isUser.middleware");
const isCompanyMiddleware = require("../middlewares/isCompany.middleware");
const isEmployeeMiddleware = require("../middlewares/isEmployee.middleware");
const validate = require("../middlewares/validation.middleware");
const Yup = require("yup");
const {
  isUserCheckRoleMiddleware,
} = require("../middlewares/roleCheck.middleware");

// Define validation schemas for orders
const createOrderSchema = Yup.object().shape({
  payment_method_id: Yup.number().integer().positive().required(),
  payment_gateway_response: Yup.string(),
  shipping_address: Yup.string().required("Shipping address is required"),
});

const updateOrderStatusSchema = Yup.object().shape({
  status: Yup.string()
    .oneOf(["pending", "processing", "completed", "cancelled"])
    .required(),
  notes: Yup.string(),
});

// Define validation schemas for wash orders
const createWashOrderSchema = Yup.object().shape({
  // FUTURE FU-001
  // customer_car_id: Yup.number().integer().positive().required('Customer car is required'),
  within_company: Yup.boolean().default(true),
  location: Yup.string().default("Company workshop"),
  wash_types: Yup.array()
    .of(Yup.number().integer().positive())
    .min(1, "At least one wash type is required")
    .required("Wash types are required"),
});

const updateWashOrderSchema = Yup.object()
  .shape({
    within_company: Yup.boolean(),
    location: Yup.string(),
    wash_types: Yup.array()
      .of(Yup.number().integer().positive())
      .min(1, "At least one wash type is required"),
  })
  .test(
    "at-least-one-field",
    "At least one field must be provided",
    (value) =>
      typeof value.within_company !== "undefined" ||
      !!value.location ||
      (Array.isArray(value.wash_types) && value.wash_types.length > 0)
  );

const assignEmployeeSchema = Yup.object().shape({
  employeeId: Yup.number()
    .integer()
    .positive()
    .required("Employee ID is required"),
});

// Define validation schemas for rental orders
const createRentalOrderSchema = Yup.object().shape({
  car_id: Yup.number().integer().positive().required("Car ID is required"),
  start_date: Yup.date().required("Start date is required"),
  end_date: Yup.date()
    .required("End date is required")
    .min(Yup.ref("start_date"), "End date must be after start date"),
});

const paginationSchema = Yup.object().shape({
  page: Yup.number().integer().min(1),
  limit: Yup.number().integer().min(1).max(100),
});

const orderRoutes = Router();

// Create order from cart
orderRoutes.post(
  "/orders",
  authMiddleware,
  isUserMiddleware,
  isUserCheckRoleMiddleware,
  validate(createOrderSchema),
  orderController.createOrder
);

// Get all orders for user
orderRoutes.get(
  "/orders",
  authMiddleware,
  isUserMiddleware,
  validate(paginationSchema, "query"),
  orderController.getOrders
);
orderRoutes.get(
  "/orders-company",
  authMiddleware,
  isCompanyMiddleware,
  validate(paginationSchema, "query"),
  orderController.getOrdersCompany
);

// Get specific order
orderRoutes.get(
  "/orders/:orderId",
  authMiddleware,
  isUserMiddleware,
  isUserCheckRoleMiddleware,
  orderController.getOrder
);
orderRoutes.get(
  "/orders/status/:status",
  authMiddleware,
  isUserMiddleware,
  isUserCheckRoleMiddleware,
  orderController.getOrdersByStatus
);

// Update order status
orderRoutes.put(
  "/orders/:orderId/status",
  authMiddleware,
  validate(updateOrderStatusSchema),
  isUserCheckRoleMiddleware,
  orderController.updateOrderStatus
);

// Wash order routes
orderRoutes.post(
  "/wash-orders",
  authMiddleware,
  isUserMiddleware,
  validate(createWashOrderSchema),
  orderController.createWashOrder
);
orderRoutes.get(
  "/all-wash-orders",
  authMiddleware,
  isCompanyMiddleware,
  orderController.getAllWashOrder
);

orderRoutes.put(
  "/wash-orders",
  authMiddleware,
  isUserMiddleware,
  validate(updateWashOrderSchema),
  orderController.updateWashOrder
);

orderRoutes.get(
  "/wash-orders/:washOrderId",
  authMiddleware,
  orderController.getWashOrderDetails
);

orderRoutes.get(
  "/company/wash-orders/pending",
  authMiddleware,
  isCompanyMiddleware,
  validate(paginationSchema, "query"),
  orderController.getPendingWashOrders
);

orderRoutes.post(
  "/wash-orders/:washOrderId/assign",
  authMiddleware,
  isCompanyMiddleware,
  validate(assignEmployeeSchema),
  orderController.assignEmployeeToWashOrder
);

orderRoutes.put(
  "/wash-orders/:washOrderId/complete",
  authMiddleware,
  isEmployeeMiddleware,
  orderController.completeWashOperation
);

orderRoutes.delete(
  "/wash-orders",
  authMiddleware,
  isUserMiddleware,
  orderController.removeWashOrder
);

// Rental order routes
orderRoutes.post(
  "/rental-orders",
  authMiddleware,
  isUserMiddleware,
  validate(createRentalOrderSchema),
  orderController.createRentalOrder
);
orderRoutes.get(
  "/all-rental-orders",
  authMiddleware,
  isCompanyMiddleware,
  orderController.getAllRentalOrder
);

orderRoutes.delete(
  "/rental-orders",
  authMiddleware,
  isUserMiddleware,
  orderController.removeRentalOrder
);
// orderRoutes.post(
//   "/create-payment-intent",
//   authMiddleware,
//   isUserMiddleware,
//   orderController.createPaymentIntent
// );

// // Route for creating a Stripe Subscription (for manual Payment Element integration)
// orderRoutes.post(
//   "/create-subscription",
//   authMiddleware,
//   isUserMiddleware,
//   orderController.createSubscription
// );

// // --- NEW: Route for creating a Stripe Checkout Session ---

module.exports = orderRoutes;
