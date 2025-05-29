const CartRepository = require("../data-access/carts");
const CarRepository = require("../data-access/cars");
const OrderItemRepository = require("../data-access/order-items");
const ProductRepository = require("../data-access/products");
const CarWashOrderRepository = require("../data-access/car-wash-orders");
const RentalOrderRepository = require("../data-access/rental-orders");
const WashTypeRepository = require("../data-access/wash-types");
const WashOrderWashTypeRepository = require("../data-access/wash-order-wash-types");
const CarOrderRepository = require("../data-access/car-orders");
import { logger } from "sequelize/lib/utils/logger";
import stripe from "../config/stripeConfig";
// FUTURE FU-001
// const CustomerCarRepository = require('../data-access/customer-cars');
const { Op } = require("sequelize");
const {
  BadRequestError,
  NotFoundError,
} = require("../utils/errors/types/Api.error");
const { createPagination } = require("../utils/responseHandler");

const cartController = {
  // Get current active cart for user
  getActiveCart: async (req, res, next) => {
    try {
      // Find active cart or create a new one
      let cart = await CartRepository.findUserActiveCart(req.user.user_id);

      if (!cart) {
        cart = await CartRepository.create({
          user_id: req.user.user_id,
          status: "cart",
        });
      }

      // Get cart with items, car wash orders, rental orders, and car orders
      cart = await CartRepository.findCartWithItems(cart.order_id);

      return res.success("Cart retrieved successfully", cart);
    } catch (error) {
      next(error);
    }
  },

  // Get all carts for user
  getCarts: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const { count, rows } = await CartRepository.getUserCarts(
        req.user.user_id,
        page,
        limit
      );

      const pagination = createPagination(page, limit, count);

      return res.success("Carts retrieved successfully", rows, pagination);
    } catch (error) {
      next(error);
    }
  },

  // Get all orders for user (carts with status other than 'cart')
  getOrders: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const { count, rows } = await CartRepository.findUserOrders(
        req.user.user_id,
        page,
        limit
      );

      const pagination = createPagination(page, limit, count);

      return res.success("Orders retrieved successfully", rows, pagination);
    } catch (error) {
      next(error);
    }
  },

  // Get order details
  getOrderDetails: async (req, res, next) => {
    try {
      const { cartId } = req.params;

      const order = await CartRepository.findOrderDetails(cartId);

      if (!order) {
        throw new NotFoundError("Order not found");
      }

      // Make sure the order belongs to the user
      if (order.user_id !== req.user.user_id && !req.adminEmployee) {
        throw new BadRequestError(
          "You do not have permission to view this order"
        );
      }

      return res.success("Order retrieved successfully", order);
    } catch (error) {
      next(error);
    }
  },

  // Add item to cart
  addToCart: async (req, res, next) => {
    try {
      const {
        item_type,
        product_id,
        quantity,
        car_id,
        is_rental,
        wash_types,
        within_company,
        location,
        company_id,
      } = req.body;

      // Find active cart or create a new one
      let cart = await CartRepository.findUserActiveCart(req.user.user_id);

      if (!cart) {
        cart = await CartRepository.create({
          user_id: req.user.user_id,
          status: "cart",
        });
      }

      // Process based on item type
      switch (item_type) {
        case "product":
          try {
            // Use transaction-based repository method
            cart = await CartRepository.addProductToCart(
              req.user.user_id,
              product_id,
              quantity
            );
          } catch (error) {
            throw new BadRequestError(error.message);
          }
          break;

        case "car":
          // Handle adding car to cart (sale or rental)
          if (cart.rentalOrder || cart.carOrder) {
            throw new BadRequestError(
              "A car is already in your cart. Please checkout or remove it first."
            );
          }

          if (is_rental) {
            if (!req.body.start_date || !req.body.end_date) {
              throw new BadRequestError(
                "Start date and end date are required for car rentals"
              );
            }

            try {
              // Use transaction-based repository method for rentals
              await RentalOrderRepository.addRentalToCart(
                cart.order_id,
                car_id,
                req.body.start_date,
                req.body.end_date
              );
            } catch (error) {
              throw new BadRequestError(
                `Failed to add rental car: ${error.message}`
              );
            }
          } else {
            try {
              // Use transaction-based repository method for car sales
              await CarOrderRepository.addCarToCart(cart.order_id, car_id);
            } catch (error) {
              throw new BadRequestError(error.message);
            }
          }
          break;

        case "wash_service":
          // Handle adding wash service to cart
          if (cart.carWashOrder) {
            throw new BadRequestError(
              "A car wash service is already in your cart. Please checkout or remove it first."
            );
          }

          if (
            !wash_types ||
            !Array.isArray(wash_types) ||
            wash_types.length === 0
          ) {
            throw new BadRequestError("At least one wash type is required");
          }

          try {
            // Use transaction-based repository method
            await CarWashOrderRepository.addWashServiceToCart(
              cart.order_id,
              {
                customer_id: req.user.user_id,
                company_id,
                within_company: within_company || true,
                location: location || "Company workshop",
              },
              wash_types
            );
          } catch (error) {
            throw new BadRequestError(
              `Failed to add wash service: ${error.message}`
            );
          }
          break;

        default:
          throw new BadRequestError(
            'Invalid item type. Must be "product", "car", or "wash_service"'
          );
      }

      // Get updated cart with all associations
      cart = await CartRepository.findCartWithItems(cart.order_id);

      return res.success(
        `${
          item_type.charAt(0).toUpperCase() + item_type.slice(1)
        } added to cart`,
        cart
      );
    } catch (error) {
      next(error);
    }
  },

  // Remove car order from cart
  removeCarOrder: async (req, res, next) => {
    try {
      // Find active cart
      const cart = await CartRepository.findUserActiveCart(req.user.user_id);

      if (!cart) {
        throw new NotFoundError("No active cart found");
      }

      // Find car order
      if (!cart.carOrder) {
        throw new NotFoundError("No car found in this cart");
      }

      // Delete car order
      await CarOrderRepository.deleteByOrderId(cart.order_id);

      // Check if cart is empty and delete if needed
      const isEmpty = await cartController.isCartEmptyAndDelete(cart);
      if (isEmpty) {
        return res.success("Cart is now empty and has been removed");
      }

      // Get updated cart with all associations
      const updatedCart = await CartRepository.findCartWithItems(cart.order_id);
      return res.success("Car removed from cart", updatedCart);
    } catch (error) {
      next(error);
    }
  },

  // Update cart item quantity
  updateCartItem: async (req, res, next) => {
    try {
      const { order_item_id, quantity } = req.body;

      // Find the item
      const item = await OrderItemRepository.findById(order_item_id);

      if (!item) {
        throw new NotFoundError("Cart item not found");
      }

      // Check if item belongs to user's cart
      const cart = await CartRepository.findUserActiveCart(req.user.user_id);

      if (!cart || item.order_id !== cart.order_id) {
        throw new BadRequestError("Item does not belong to your active cart");
      }

      // Check if product is in stock
      const product = await ProductRepository.findById(item.product_id);

      if (product.stock < quantity) {
        throw new BadRequestError("Not enough stock available");
      }

      // Update item
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        await OrderItemRepository.delete(order_item_id);
      } else {
        // Update quantity
        await OrderItemRepository.update(order_item_id, { quantity });
      }

      // Check if cart is empty and delete if needed
      const isEmpty = await cartController.isCartEmptyAndDelete(cart);
      if (isEmpty) {
        return res.success("Cart is now empty and has been removed");
      }

      // Get updated cart with all associations
      const updatedCart = await CartRepository.findCartWithItems(cart.order_id);
      return res.success("Cart updated successfully", updatedCart);
    } catch (error) {
      next(error);
    }
  },

  // Remove item from cart
  removeCartItem: async (req, res, next) => {
    try {
      const { order_item_id } = req.params;

      // Find the item
      const item = await OrderItemRepository.findById(order_item_id);

      if (!item) {
        throw new NotFoundError("Cart item not found");
      }

      // Check if item belongs to user's cart
      const cart = await CartRepository.findUserActiveCart(req.user.user_id);

      if (!cart || item.order_id !== cart.order_id) {
        throw new BadRequestError("Item does not belong to your active cart");
      }

      // Remove item
      await OrderItemRepository.delete(order_item_id);

      // Check if cart is empty and delete if needed
      const isEmpty = await cartController.isCartEmptyAndDelete(cart);
      if (isEmpty) {
        return res.success("Cart is now empty and has been removed");
      }

      // Get updated cart with all associations
      const updatedCart = await CartRepository.findCartWithItems(cart.order_id);
      return res.success("Item removed from cart", updatedCart);
    } catch (error) {
      next(error);
    }
  },

  // Clear cart
  clearCart: async (req, res, next) => {
    try {
      // Find active cart
      const cart = await CartRepository.findUserActiveCart(req.user.user_id);

      if (!cart) {
        return res.success("No active cart found");
      }

      // Use transaction-based method to clear cart
      await CartRepository.clearCartItems(cart.order_id);

      return res.success("Cart cleared successfully");
    } catch (error) {
      next(error);
    }
  },

  // Helper function to check if cart is empty and delete if needed
  isCartEmptyAndDelete: async (cart) => {
    // Get updated cart with all associations
    const updatedCart = await CartRepository.findCartWithItems(cart.order_id);

    // Check if cart is empty (no items, no car wash, no rental, no car order)
    if (
      updatedCart.orderItems.length === 0 &&
      !updatedCart.carWashOrder &&
      !updatedCart.rentalOrder &&
      !updatedCart.carOrder
    ) {
      await CartRepository.delete(cart.order_id);
      return true;
    }
    return false;
  },

  // Unified method to remove any type of item from cart
  removeItem: async (req, res, next) => {
    try {
      const { item_type, item_id, wash_order_id, wash_type_id } = req.body;

      // Find active cart
      const cart = await CartRepository.findUserActiveCart(req.user.user_id);

      if (!cart) {
        throw new NotFoundError("No active cart found");
      }

      // Handle removal based on item type
      switch (item_type) {
        case "product":
          // Find the item
          const item = await OrderItemRepository.findById(item_id);

          if (!item) {
            throw new NotFoundError("Cart item not found");
          }

          // Check if item belongs to user's cart
          if (item.order_id !== cart.order_id) {
            throw new BadRequestError(
              "Item does not belong to your active cart"
            );
          }

          // Remove item
          await OrderItemRepository.delete(item_id);
          break;

        case "rental_car":
          // Verify the rental exists and belongs to this cart
          const rentalOrder = await RentalOrderRepository.findById(item_id);

          if (!rentalOrder) {
            throw new NotFoundError("Rental car not found in cart");
          }

          if (rentalOrder.order_id !== cart.order_id) {
            throw new BadRequestError(
              "Rental car does not belong to your active cart"
            );
          }

          // Remove rental order
          await RentalOrderRepository.delete(item_id);
          break;

        case "sale_car":
          // Verify the car order exists and belongs to this cart
          const carOrder = await CarOrderRepository.findById(item_id);

          if (!carOrder) {
            throw new NotFoundError("Car not found in cart");
          }

          if (carOrder.orders_order_id !== cart.order_id) {
            throw new BadRequestError(
              "Car does not belong to your active cart"
            );
          }

          // Remove car order
          await CarOrderRepository.delete(item_id);
          break;

        case "wash_service":
          // Verify the wash order exists and belongs to this cart
          const washOrder = await CarWashOrderRepository.findById(
            wash_order_id
          );

          if (!washOrder) {
            throw new NotFoundError("Car wash service not found in cart");
          }

          if (washOrder.order_id !== cart.order_id) {
            throw new BadRequestError(
              "Car wash service does not belong to your active cart"
            );
          }

          // Remove wash order with transaction
          await CarWashOrderRepository.delete(wash_order_id);
          break;

        case "wash_type":
          if (!wash_order_id || !wash_type_id) {
            throw new BadRequestError(
              "Both wash order ID and wash type ID are required"
            );
          }

          // Verify the wash order exists and belongs to this cart
          const washOrderForType = await CarWashOrderRepository.findById(
            wash_order_id
          );

          if (!washOrderForType) {
            throw new NotFoundError("Car wash service not found in cart");
          }

          if (washOrderForType.order_id !== cart.order_id) {
            throw new BadRequestError(
              "Car wash service does not belong to your active cart"
            );
          }

          // Use transaction-based method to remove wash type
          await CarWashOrderRepository.removeWashType(
            wash_order_id,
            wash_type_id
          );
          break;

        default:
          throw new BadRequestError(
            'Invalid item type. Must be "product", "rental_car", "sale_car", "wash_service", or "wash_type"'
          );
      }

      // Check if cart is empty and delete if needed
      const isEmpty = await cartController.isCartEmptyAndDelete(cart);
      if (isEmpty) {
        return res.success("Cart is now empty and has been removed");
      }

      // Get updated cart with all associations
      const updatedCart = await CartRepository.findCartWithItems(cart.order_id);
      return res.success("Item removed from cart", updatedCart);
    } catch (error) {
      next(error);
    }
  },
  createCheckoutSession: async (req, res, next) => {
    // Find active cart or create a new one
    try {
      let cart = await CartRepository.findUserActiveCart(req.user.user_id);

      if (!cart) {
        throw new NotFoundError("No active cart found");
      }

      // Get cart with items, car wash orders, rental orders, and car orders
      cart = await CartRepository.findCartWithItems(cart.order_id);
      if (!cart || cart.orderItems.length === 0) {
        return res.status(400).json({ error: "No items in cart" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: cart.orderItems.map((item) => {
          // Convert price to fils (1 KWD = 1000 fils) and ensure it's divisible by 10
          const priceInFils = parseFloat(item.price) * 1000;
          const roundedPrice = Math.round(priceInFils / 10) * 10; // Ensure divisible by 10

          return {
            price_data: {
              currency: "KWD",
              product_data: {
                name: item.product.product_name,
                description: item.product.description,
                images:
                  item.product.images && item.product.images.length > 0
                    ? item.product.images
                    : ["https://example.com/placeholder-image.jpg"],
              },
              unit_amount: roundedPrice, // Price in fils, divisible by 10
            },
            quantity: item.quantity,
          };
        }),
        mode: "payment",
        success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/payment-cancel`,
      });
      res.json({ id: session.id });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = cartController;
