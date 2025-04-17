const { Router } = require("express");
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isUserMiddleware = require("../middlewares/isUser.middleware");
const validate = require("../middlewares/validation.middleware");
const Yup = require("yup");

// Define validation schemas
const addToCartSchema = Yup.object().shape({
  item_type: Yup.string().oneOf(['product', 'car', 'wash_service']).required('Item type is required'),
  
  // Product fields - required when item_type is 'product'
  product_id: Yup.number().integer().positive()
    .when('item_type', {
      is: 'product',
      then: schema => schema.required('Product ID is required for products')
    }),
  quantity: Yup.number().integer().positive()
    .when('item_type', {
      is: 'product',
      then: schema => schema.required('Quantity is required for products')
    }),
  
  // Car fields - required when item_type is 'car'
  car_id: Yup.number().integer().positive()
    .when('item_type', {
      is: 'car',
      then: schema => schema.required('Car ID is required for cars')
    }),
  is_rental: Yup.boolean()
    .when('item_type', {
      is: 'car',
      then: schema => schema.required('Please specify if this is a rental or purchase')
    }),
  start_date: Yup.date()
    .when(['item_type', 'is_rental'], {
      is: (type, isRental) => type === 'car' && isRental === true,
      then: schema => schema.required('Start date is required for car rentals')
    }),
  end_date: Yup.date()
    .when(['item_type', 'is_rental'], {
      is: (type, isRental) => type === 'car' && isRental === true,
      then: schema => schema.required('End date is required for car rentals')
        .min(Yup.ref('start_date'), 'End date must be after start date')
    }),
  
  // Wash service fields - required when item_type is 'wash_service'
  // customer_car_id: Yup.number().integer().positive()
  //   .when('item_type', {
  //     is: 'wash_service',
  //     then: schema => schema.required('Customer car ID is required for wash services')
  //   }),
  wash_types: Yup.array().of(Yup.number().integer().positive()),
  company_id: Yup.number().integer().positive(),
  within_company: Yup.boolean(),
  location: Yup.string()
});

const updateCartItemSchema = Yup.object().shape({
  order_item_id: Yup.number().integer().positive().required(),
  quantity: Yup.number().integer().min(0).required()
});

const paginationSchema = Yup.object().shape({
  page: Yup.number().integer().min(1),
  limit: Yup.number().integer().min(1).max(100)
});

// Add new remove item schema
const removeItemSchema = Yup.object().shape({
  item_type: Yup.string()
    .oneOf(['product', 'rental_car', 'sale_car', 'wash_service', 'wash_type'])
    .required('Item type is required'),
  item_id: Yup.number().integer().positive()
    .when('item_type', {
      is: 'product',
      then: schema => schema.required('Item ID is required for products')
    }),
  // Additional fields for wash_type
  wash_order_id: Yup.number().integer().positive()
    .when('item_type', {
      is: ['wash_service', 'wash_type'],
      then: schema => schema.required('Wash order ID is required for wash type removal')
    }),
  wash_type_id: Yup.number().integer().positive()
    .when('item_type', {
      is: 'wash_type',
      then: schema => schema.required('Wash type ID is required for wash type removal')
    })
});

const cartRoutes = Router();

// Cart routes - removing /api prefix since it's added globally
cartRoutes.get(
  "/cart",
  authMiddleware,
  isUserMiddleware,
  cartController.getActiveCart
);

cartRoutes.get(
  "/carts",
  authMiddleware,
  isUserMiddleware,
  validate(paginationSchema, 'query'),
  cartController.getCarts
);

// Orders routes (carts with non-cart status)
cartRoutes.get(
  "/user-orders",
  authMiddleware,
  isUserMiddleware,
  validate(paginationSchema, 'query'),
  cartController.getOrders
);

cartRoutes.get(
  "/user-orders/:cartId",
  authMiddleware,
  isUserMiddleware,
  cartController.getOrderDetails
);

// Regular cart routes
cartRoutes.post(
  "/cart/items",
  authMiddleware,
  isUserMiddleware,
  validate(addToCartSchema),
  cartController.addToCart
);

cartRoutes.put(
  "/cart/items",
  authMiddleware,
  isUserMiddleware,
  validate(updateCartItemSchema),
  cartController.updateCartItem
);

cartRoutes.delete(
  "/cart/items/:order_item_id",
  authMiddleware,
  isUserMiddleware,
  cartController.removeCartItem
);

// Car order removal - using the same URL pattern but with a different parameter name
cartRoutes.delete(
  "/cart/car",
  authMiddleware,
  isUserMiddleware,
  cartController.removeCarOrder
);

// Unified item removal endpoint
cartRoutes.delete(
  "/cart/items",
  authMiddleware,
  isUserMiddleware,
  validate(removeItemSchema),
  cartController.removeItem
);

cartRoutes.delete(
  "/cart",
  authMiddleware,
  isUserMiddleware,
  cartController.clearCart
);

module.exports = cartRoutes;
