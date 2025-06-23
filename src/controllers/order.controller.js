const { Op, or } = require("sequelize");
// Import repositories
import OrderRepository from "../data-access/orders";
import OrderItemRepository from "../data-access/order-items";
import OrderStatusHistoryRepository from "../data-access/order-status-histories";
import CarWashOrderRepository from "../data-access/car-wash-orders";
import RentalOrderRepository from "../data-access/rental-orders";
import EmployeeRepository from "../data-access/employees";
import OrderitemsRepository from "../data-access/order-items";
import ProductRepository from "../data-access/products";
import CustomerCarRepository from "../data-access/customer-cars";
import CompanyRepository from "../data-access/companies";
import CarRepository from "../data-access/cars";
import WashTypeRepository from "../data-access/wash-types";
import WashOrderWashTypeRepository from "../data-access/wash-order-wash-types";
import WashOrderOperationRepository from "../data-access/wash-order-operations";
import PaymentMethodRepository from "../data-access/payment-methods";

const { createPagination } = require("../utils/responseHandler");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
} = require("../utils/errors/types/Api.error");

const CartRepository = require("../data-access/carts");
const CartModel = require("../models/Cart");

const base64 = require("base64-js");
const axios = require("axios");

const orderController = {
  // Create order from cart
  createOrder: async (req, res, next) => {
    try {
      const {
        payment_method_id,
        payment_gateway_response = "{}",
        shipping_address,
      } = req.body;

      // Find active cart
      const cart = await CartRepository.findUserActiveCart(req.user.user_id);

      if (!cart) {
        throw new BadRequestError("No active cart found");
      }

      // Check if the cart has any content (items, car wash, rental)
      if (
        cart.orderItems.length === 0 &&
        !cart.carWashOrder &&
        !cart.rentalOrder
      ) {
        throw new BadRequestError("Cannot create order with empty cart");
      }

      // Verify payment method
      const paymentMethod = await PaymentMethodRepository.findById(
        payment_method_id
      );

      if (!paymentMethod) {
        throw new BadRequestError("Invalid payment method");
      }

      // Calculate total amount
      let totalAmount = 0;

      // Add product items total
      if (cart.orderItems.length > 0) {
        const productTotal = await OrderItemRepository.calculateOrderTotal(
          cart.order_id
        );
        totalAmount += productTotal;
      }

      // Add car wash total if exists
      if (cart.carWashOrder) {
        // Get wash operations total
        const washOperations =
          await WashOrderOperationRepository.findByCarWashOrderId(
            cart.carWashOrder.car_wash_order_id
          );

        for (const op of washOperations) {
          totalAmount += op.price;
        }
      }

      // Add rental total if exists
      if (cart.rentalOrder) {
        const rental = cart.rentalOrder;
        const car = await CarRepository.findById(rental.car_id);

        // Calculate rental duration in days
        const startDateTime = new Date(rental.start_date).getTime();
        const endDateTime = new Date(rental.end_date).getTime();
        const durationMs = endDateTime - startDateTime;
        const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

        // Calculate rental cost
        const rentalTotal = car.price * durationDays;
        totalAmount += rentalTotal;
      }

      // Create order in orders table
      const order = await OrderRepository.create({
        cart_order_id: cart.order_id,
        payment_method_id,
        payment_gateway_response,
        shipping_address,
        // total_amount: totalAmount,
      });
      if (!order) {
        throw new NotFoundError("order not found");
      }
      // Add initial status history
      await OrderStatusHistoryRepository.addOrderStatusHistory(
        order.id,
        "pending",
        "Order created"
      );

      // Update cart status to 'pending'
      await CartRepository.update(cart.order_id, {
        status: "pending",
      });

      // Get full order details
      const completedOrder = await OrderRepository.findById(order.id, {
        include: [
          {
            association: "cart",
            include: [
              {
                association: "orderItems",
                include: ["product"],
              },
              {
                association: "carWashOrder",
                include: ["operation"],
              },
              {
                association: "rentalOrder",
                include: [
                  {
                    association: "car",
                    include: ["images"],
                  },
                ],
              },
            ],
          },
          "statusHistory",
          "paymentMethod",
        ],
      });

      return res.success("Order created successfully", completedOrder);
    } catch (error) {
      next(error);
    }
  },

  // Get all orders for user
  getOrders: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      try {
        // Get all carts with non-cart status (orders) for user
        const { count, rows } = await CartRepository.findUserOrders(
          req.user.user_id,
          page,
          limit
        );

        // Iterate through each order to calculate its individual total price
        rows.forEach((order) => {
          let orderIndividualTotalPrice = 0; // Initialize total for *this specific* order
          order.orderItems.forEach((item) => {
            orderIndividualTotalPrice += item.quantity * parseFloat(item.price);
          });
          // Attach the calculated individual total to the current order object
          order = {
            totalPrice: parseFloat(orderIndividualTotalPrice.toFixed(2)),
            ...order,
          };
        });
        console.log("Rows with totalPrice:", rows);

        // Assuming createPagination is defined elsewhere and returns pagination metadata
        const pagination = createPagination(page, limit, count);

        // Return the modified rows (each with its totalPrice) and pagination info
        return res.success("Orders retrieved successfully", rows, pagination);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // It's better to throw a more specific error or handle it here
        throw new BadRequestError(
          "Failed to fetch orders. Error: " + error.message
        );
      }
    } catch (error) {
      next(error); // Pass the error to the next middleware (error handler)
    }
  },
  // Get all orders for user
  getOrdersCompany: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      try {
        // Get all carts with non-cart status (orders) for user
        const { count, rows } = await CartRepository.findUserOrders(
          req.user.user_id,
          page,
          limit
        );

        const pagination = createPagination(page, limit, count);

        return res.success("Orders retrieved successfully", rows, pagination);
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw new BadRequestError(
          "Failed to fetch orders. Error: " + error.message
        );
      }
    } catch (error) {
      next(error);
    }
  },
  // Get all orders for user
  getOrdersByStatus: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      try {
        // Get all carts with non-cart status (orders) for user
        const { count, rows } = await CartRepository.findUserOrdersByStatus(
          req.user.user_id,
          req.eqary.status,
          page,
          limit
        );

        const pagination = createPagination(page, limit, count);

        return res.success("Orders retrieved successfully", rows, pagination);
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw new BadRequestError(
          "Failed to fetch orders. Error: " + error.message
        );
      }
    } catch (error) {
      next(error);
    }
  },

  // Get order details
  getOrder: async (req, res, next) => {
    try {
      const { orderId } = req.params;

      // First check in orders table
      const order = await OrderRepository.findById(orderId, {
        include: [
          {
            association: "cart",
            include: [
              {
                association: "orderItems",
                include: ["product"],
              },
              {
                association: "carWashOrder",
                //customerCar
                include: ["operation"],
              },
              {
                association: "rentalOrder",
                include: [
                  {
                    association: "car",
                    include: ["images"],
                  },
                ],
              },
            ],
          },
          "statusHistory",
          "paymentMethod",
        ],
      });

      if (!order) {
        throw new NotFoundError("Order not found");
      }
      // Make sure the order belongs to the user or they're an admin
      if (order.cart.user_id !== req.userId && !req.employee) {
        throw new BadRequestError(
          "You do not have permission to view this order"
        );
      }

      return res.success("Order retrieved successfully", order);
    } catch (error) {
      next(error);
    }
  },

  // Update order status
  updateOrderStatus: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { status, notes } = req.body;

      const order = await OrderRepository.findById(orderId);

      if (!order) {
        throw new NotFoundError("Order not found");
      }

      // Add status history entry
      await OrderStatusHistoryRepository.addOrderStatusHistory(
        orderId,
        status,
        notes
      );

      // If status is 'completed', update the cart status
      if (status === "completed") {
        await CartRepository.update(order.cart_order_id, {
          status: "completed",
        });
      }
      // If status is 'cancelled', update the cart status
      else if (status === "cancelled") {
        await CartRepository.update(order.cart_order_id, {
          status: "cancelled",
        });
      }

      // Get updated order
      const updatedOrder = await OrderRepository.findById(orderId, {
        include: [
          {
            association: "cart",
            include: [
              {
                association: "orderItems",
                include: ["product"],
              },
              {
                association: "carWashOrder",
                include: ["customerCar", "operation"],
              },
              {
                association: "rentalOrder",
                include: [
                  {
                    association: "car",
                    include: ["images"],
                  },
                ],
              },
            ],
          },
          "statusHistory",
          "paymentMethod",
        ],
      });

      return res.success("Order status updated successfully", updatedOrder);
    } catch (error) {
      next(error);
    }
  },

  // Create new wash order with wash types
  createWashOrder: async (req, res, next) => {
    try {
      const {
        // FUTURE FU-001
        customer_car_id,
        within_company = true,
        location = "Company workshop",
        wash_types,
      } = req.body;

      // Find active cart or create a new one
      let cart = await CartRepository.findUserActiveCart(req.user.user_id);

      if (!cart) {
        cart = await CartRepository.create({
          user_id: req.user.user_id,
          status: "cart",
        });
      }

      // Check if wash order already exists for this cart
      if (cart.carWashOrder) {
        throw new BadRequestError(
          "A car wash order already exists in this cart"
        );
      }

      // FUTURE FU-001: Verify car exists and belongs to user
      // const car = await CustomerCarRepository.findById(customer_car_id);

      // if (!car || car.customer_id !== req.user.user_id) {
      //   throw new BadRequestError('Car not found or does not belong to you');
      // }

      // Verify wash types exist and prepare data
      if (
        !wash_types ||
        !Array.isArray(wash_types) ||
        wash_types.length === 0
      ) {
        throw new BadRequestError("At least one wash type is required");
      }

      const washTypeData = [];
      let totalAmount = 0;

      for (const typeId of wash_types) {
        const washType = await WashTypeRepository.findById(typeId);

        if (!washType) {
          throw new BadRequestError(`Wash type with ID ${typeId} not found`);
        }

        washTypeData.push({
          typeId: washType.type_id,
          price: washType.price,
        });

        totalAmount += washType.price;
      }

      // Create car wash order with all details
      const carWashOrderData = {
        order_id: cart.order_id,
        customer_id: req.user.user_id,
        customer_car_id,
        within_company,
        location,
      };

      // Create wash order with types
      const carWashOrder = await CarWashOrderRepository.createWithWashTypes(
        carWashOrderData,
        washTypeData
      );

      // Get complete cart with wash order
      const updatedCart = await CartRepository.findCartWithItems(cart.order_id);

      return res.success("Wash order added to cart successfully", updatedCart);
    } catch (error) {
      next(error);
    }
  },
  getAllWashOrder: async (req, res, next) => {
    try {
      // const { company_id } = req.company;

      // if (!company_id) {
      //   // return res.json(req.company.company_id);
      //   throw new NotFoundError("Company id Is Required");
      // }
      // return res.json(req.company);

      const employee = await EmployeeRepository.findOne({
        where: {
          user_id: req.userId,
        },
      });

      if (!employee) {
        throw new ForbiddenError("Not Found This Employee");
      }
      const carWashOrder = await CarWashOrderRepository.findAll({
        where: {
          company_id: employee.company_id,
        },
        include: [
          {
            association: "company", // must match alias in `CarWashOrder.belongsTo(models.Company, { as: 'company' })`
            attributes: ["company_name"], // fetch only company_name from related Company
          },
          {
            association: "order", // must match alias in `CarWashOrder.belongsTo(models.Company, { as: 'company' })`
            // attributes: [""], // fetch only company_name from related Company
          },
          {
            association: "washTypes", // must match alias in `CarWashOrder.belongsTo(models.Company, { as: 'company' })`
            attributes: ["description", "name"], // fetch only company_name from related Company
            // include: [
            //   {
            //     association: "washorders_washtypes", // must match alias in `CarWashOrder.belongsTo(models.Company, { as: 'company' })`
            //     // attributes: ["paid_price"], // fetch only company_name from related Company
            //   },
            // ],
          },
          {
            association: "customer", // must match alias in `CarWashOrder.belongsTo(models.Company, { as: 'company' })`
            attributes: ["name"], // fetch only company_name from related Company
          },
          {
            association: "operation", // must match alias in `CarWashOrder.belongsTo(models.Company, { as: 'company' })`
            // attributes: ["company_name"], // fetch only company_name from related Company
            include: {
              association: "assignedEmployee", // must match alias in `CarWashOrder.belongsTo(models.Company, { as: 'company' })`
              include: {
                association: "user", // must match alias in `CarWashOrder.belongsTo(models.Company, { as: 'company' })`
              },
            },
          },
        ],
      });

      // Get complete cart with wash order

      return res.success("Wash order Returned successfully", carWashOrder);
    } catch (error) {
      next(error);
    }
  },

  // Update an existing wash order in the cart
  updateWashOrder: async (req, res, next) => {
    try {
      const { within_company, location, wash_types } = req.body;

      // Find active cart
      const cart = await CartRepository.findUserActiveCart(req.user.user_id);

      if (!cart || !cart.carWashOrder) {
        throw new BadRequestError("No car wash order found in active cart");
      }

      const washOrderId = cart.carWashOrder.wash_order_id;

      // Prepare updates
      const updates = {};
      if (typeof within_company !== "undefined") {
        updates.within_company = within_company;
      }
      if (location) {
        updates.location = location;
      }

      // Update wash order basic info if needed
      if (Object.keys(updates).length > 0) {
        await CarWashOrderRepository.update(washOrderId, updates);
      }

      // Update wash types if provided
      if (wash_types && Array.isArray(wash_types) && wash_types.length > 0) {
        // Verify wash types and prepare data
        const washTypeData = [];

        for (const typeId of wash_types) {
          const washType = await WashTypeRepository.findById(typeId);

          if (!washType) {
            throw new BadRequestError(`Wash type with ID ${typeId} not found`);
          }

          washTypeData.push({
            typeId: washType.type_id,
            price: washType.price,
          });
        }

        // Update wash types
        await WashOrderWashTypeRepository.updateWashOrderTypes(
          washOrderId,
          washTypeData
        );
      }

      // Get updated cart
      const updatedCart = await CartRepository.findCartWithItems(cart.order_id);

      return res.success("Wash order updated successfully", updatedCart);
    } catch (error) {
      next(error);
    }
  },

  // Get wash order details (for company employees to view)
  getWashOrderDetails: async (req, res, next) => {
    try {
      const { washOrderId } = req.params;

      const washOrder =
        await CarWashOrderRepository.findCarWashOrderWithDetails(washOrderId);

      if (!washOrder) {
        throw new NotFoundError("Wash order not found");
      }

      // Check permissions - either the company employee or the customer can view
      if (req.company) {
        // For company employees, check if this order uses their wash types
        const hasCompanyWashTypes = washOrder.washTypes.some(
          (type) => type.company_id === req.company.company_id
        );

        if (!hasCompanyWashTypes) {
          throw new ForbiddenError(
            "You do not have permission to view this wash order"
          );
        }
      } else if (req.user && washOrder.customer_id !== req.user.user_id) {
        throw new ForbiddenError(
          "You do not have permission to view this wash order"
        );
      }

      return res.success(
        "Wash order details retrieved successfully",
        washOrder
      );
    } catch (error) {
      next(error);
    }
  },

  // Get pending wash orders for a company
  getPendingWashOrders: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      // Only company can access this
      if (!req.company) {
        throw new ForbiddenError("Only companies can access this endpoint");
      }

      // Get pending wash orders
      const { count, rows } =
        await CarWashOrderRepository.getPendingWashOrdersForCompany(
          req.company.company_id,
          page,
          limit
        );

      const pagination = createPagination(page, limit, count);

      return res.success(
        "Pending wash orders retrieved successfully",
        rows,
        pagination
      );
    } catch (error) {
      next(error);
    }
  },

  // Assign employee to wash order operation
  assignEmployeeToWashOrder: async (req, res, next) => {
    try {
      const { washOrderId } = req.params;
      const { employeeId } = req.body;

      // Only company can assign employees
      // if (!req.company) {
      //   throw new ForbiddenError("Only companies can assign employees");
      // }

      const employee = await EmployeeRepository.findOne({
        where: {
          user_id: req.userId,
        },
      });

      if (!employee) {
        throw new ForbiddenError(
          "Employee not found or does not belong to your company"
        );
      }

      // Check if wash order exists
      const washOrder = await CarWashOrderRepository.findWithWashTypes(
        washOrderId
      );

      if (!washOrder) {
        throw new NotFoundError("Wash order not found");
      }
      // Check if this order has wash types from this company
      const hasCompanyWashTypes = washOrder.washTypes.some(
        (type) => type.company_id === employee.company_id
      );

      if (!hasCompanyWashTypes) {
        throw new ForbiddenError(
          "You do not have permission to assign employee to this wash order"
        );
      }

      // Check if employee exists and belongs to company
      // const employee = await EmployeeRepository.findByUserAndCompany(
      //   employeeId,
      //   req.company.company_id
      // );

      // if (!employee) {
      //   throw new BadRequestError(
      //     "Employee not found or does not belong to your company"
      //   );
      // }

      // Check if operation already exists
      let operation = await WashOrderOperationRepository.findByWashOrderId(
        washOrderId
      );

      if (operation) {
        // Update existing operation
        await WashOrderOperationRepository.update(operation.wash_order_id, {
          employee_assigned_id: employeeId,
          assignedEmployeeUserId: employeeId,
        });
      } else {
        // Create new operation
        operation = await WashOrderOperationRepository.create({
          wash_order_id: washOrderId,
          employee_assigned_id: employeeId,
          company_id: req.company.company_id,
          assignedEmployeeUserId: employeeId,
          operation_start_at: new Date(),
        });
      }

      // Get updated operation
      operation = await WashOrderOperationRepository.findByWashOrderId(
        washOrderId
      );

      return res.success(
        "Employee assigned to wash order successfully",
        operation
      );
    } catch (error) {
      next(error);
    }
  },

  toggleWashOperationStatus: async (req, res, next) => {
    try {
      const { washOrderId } = req.params;
      const { status } = req.body;
      // Only company employee can mark operation as complete
      if (!req.employee) {
        throw new ForbiddenError(
          "Only employees can mark operations as complete"
        );
      }

      // Find operation
      const operation = await WashOrderOperationRepository.findByWashOrderId(
        washOrderId
      );

      if (!operation) {
        throw new NotFoundError("Wash operation not found");
      }

      await operation.update({
        status: status,
      });
      return res.success("Toogle Status for Wash order ", operation);
      // Update operation
    } catch (error) {
      next(error);
    }
  },
  // Mark wash operation as complete
  completeWashOperation: async (req, res, next) => {
    try {
      const { washOrderId } = req.params;

      // Only company employee can mark operation as complete
      if (!req.employee) {
        throw new ForbiddenError(
          "Only employees can mark operations as complete"
        );
      }

      // Find operation
      const operation = await WashOrderOperationRepository.findByWashOrderId(
        washOrderId
      );

      if (!operation) {
        throw new NotFoundError("Wash operation not found");
      }

      // Check if employee is assigned to this operation
      if (operation.employee_assigned_id !== req.userId) {
        throw new ForbiddenError("You are not assigned to this operation");
      }

      // Update operation
      await WashOrderOperationRepository.update(operation.wash_order_id, {
        operation_done_at: new Date(),
      });

      // Update order status if not already completed
      const order = await OrderRepository.findByCartOrderId(
        operation.washOrder.order_id
      );

      if (order && order.status !== "completed") {
        // Add status history
        await OrderStatusHistoryRepository.addOrderStatusHistory(
          order.order_id,
          "completed",
          "Wash operation completed"
        );

        // Update order
        await OrderRepository.update(order.order_id, {
          status: "completed",
        });

        // Update cart
        await CartRepository.update(operation.washOrder.order_id, {
          status: "completed",
        });
      }

      // Get updated operation
      const updatedOperation =
        await WashOrderOperationRepository.findByWashOrderId(washOrderId);

      return res.success("Wash operation marked as complete", updatedOperation);
    } catch (error) {
      next(error);
    }
  },

  // Remove wash order from cart
  removeWashOrder: async (req, res, next) => {
    try {
      // Find active cart
      const cart = await CartRepository.findUserActiveCart(req.user.user_id);

      if (!cart || !cart.carWashOrder) {
        throw new BadRequestError("No car wash order found in active cart");
      }

      // Delete the car wash order
      await CarWashOrderRepository.delete(cart.carWashOrder.car_wash_order_id);

      // Get updated cart
      const updatedCart = await CartRepository.findCartWithItems(cart.order_id);

      // Delete cart if it's empty (no items, no car wash, no rental)
      if (updatedCart.orderItems.length === 0 && !updatedCart.rentalOrder) {
        await CartRepository.delete(cart.order_id);
        return res.success("Cart is now empty and has been removed");
      }

      return res.success("Car wash order removed from cart", updatedCart);
    } catch (error) {
      next(error);
    }
  },

  // Create new rental order
  createRentalOrder: async (req, res, next) => {
    try {
      const { car_id, start_date, end_date } = req.body;

      // Find active cart or create a new one
      let cart = await CartRepository.findUserActiveCart(req.user.user_id);

      if (!cart) {
        cart = await CartRepository.create({
          user_id: req.user.user_id,
          status: "cart",
        });
      }

      // Check if rental order already exists for this cart
      if (cart.rentalOrder) {
        throw new BadRequestError("A rental order already exists in this cart");
      }

      // Verify the car exists
      const car = await CarRepository.findById(car_id);

      if (!car) {
        throw new BadRequestError("Car not found");
      }

      // Check if the car is available for rental
      if (car.sale_or_rental !== "rent") {
        throw new BadRequestError("This car is not available for rental");
      }

      // Check if car is available for the requested dates
      const overlappingRentals = await RentalOrderRepository.count({
        where: {
          car_id,
          [Op.or]: [
            {
              [Op.and]: [
                { start_date: { [Op.lte]: start_date } },
                { end_date: { [Op.gte]: start_date } },
              ],
            },
            {
              [Op.and]: [
                { start_date: { [Op.lte]: end_date } },
                { end_date: { [Op.gte]: end_date } },
              ],
            },
            {
              [Op.and]: [
                { start_date: { [Op.gte]: start_date } },
                { end_date: { [Op.lte]: end_date } },
              ],
            },
          ],
          "$cart.status$": { [Op.ne]: "cancelled" }, // Exclude cancelled rentals
        },
        include: [
          {
            model: CartModel,
            as: "cart",
            required: true,
          },
        ],
      });

      if (overlappingRentals > 0) {
        throw new BadRequestError(
          "Car is not available for the requested dates"
        );
      }

      // Create rental order
      const rentalOrder = await RentalOrderRepository.create({
        order_id: cart.order_id,
        car_id,
        start_date,
        end_date,
      });

      // Get updated cart with rental order
      const updatedCart = await CartRepository.findCartWithItems(cart.order_id);

      return res.success(
        "Rental order added to cart successfully",
        updatedCart
      );
    } catch (error) {
      next(error);
    }
  },
  getAllRentalOrder: async (req, res, next) => {
    try {
      const { company_id } = req.company;

      if (!company_id) {
        // return res.json(req.company.company_id);
        throw new NotFoundError("Company id Is Required");
      }

      // Create rental order
      const rentalOrders = await RentalOrderRepository.findAll({
        include: [
          {
            association: "car",
            where: {
              company_id: 29,
            },
            include: [
              {
                association: "company", // from `Car` model
                attributes: ["company_name"], // optional
              },
            ],
          },
        ],
      });

      return res.success(
        "Rental order added to cart successfully",
        rentalOrders
      );
    } catch (error) {
      next(error);
    }
  },

  // Remove rental order from cart
  removeRentalOrder: async (req, res, next) => {
    try {
      // Find active cart
      const cart = await CartRepository.findUserActiveCart(req.user.user_id);

      if (!cart || !cart.rentalOrder) {
        throw new BadRequestError("No rental order found in active cart");
      }

      // Delete the rental order
      await RentalOrderRepository.delete(cart.rentalOrder.rental_order_id);

      // Get updated cart
      const updatedCart = await CartRepository.findCartWithItems(cart.order_id);

      // Delete cart if it's empty (no items, no car wash, no rental)
      if (updatedCart.orderItems.length === 0 && !updatedCart.carWashOrder) {
        await CartRepository.delete(cart.order_id);
        return res.success("Cart is now empty and has been removed");
      }

      return res.success("Rental order removed from cart", updatedCart);
    } catch (error) {
      next(error);
    }
  },
  toggleRentalStatus: async (req, res, next) => {
    try {
      const { rentalOrderId } = req.params;
      const { status } = req.body;
      // Only company employee can mark operation as complete
      if (!req.employee) {
        throw new ForbiddenError(
          "Only employees can mark operations as complete"
        );
      }

      // Find operation
      const order = await RentalOrderRepository.findById(rentalOrderId);

      if (!order) {
        throw new NotFoundError("Wash operation not found");
      }

      await order.update({
        status: status,
      });
      return res.success("Toogle Status for Rental order ", order);
      // Update operation
    } catch (error) {
      next(error);
    }
  },
  // updateStatus: async (req, res, next) => {
  //   try {
  //     const { status } = req.body;
  //     // Find active cart
  //     const cart = await CartRepository.findUserActiveCart(req.user.user_id);

  //     if (!cart || !cart.rentalOrder) {
  //       throw new BadRequestError("No rental order found in active cart");
  //     }

  //     // Delete the rental order
  //     await RentalOrderRepository.update(cart.rentalOrder.rental_order_id, {
  //       status: status,
  //     });

  //     // Delete cart if it's empty (no items, no car wash, no rental)
  //     return res.success("Rental order Status has changed ", updatedCart);
  //   } catch (error) {
  //     next(error);
  //   }
  // },
  authenticateCbk: async () => {
    try {
      const response = await axios.post(
        `${process.env.CBK_TEST_URL}/api/authenticate`,
        {
          ClientId: process.env.CBK_CLIENT_ID,
          ClientSecret: process.env.CBK_CLIENT_SECRET,
          ENCRP_KEY: process.env.CBK_ENCRYPT_KEY,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("CBK Auth Response:", response.data); // Log full response

      if (response.data.Status === "1") {
        return response.data.AccessToken;
      } else {
        throw new Error(
          `CBK Authentication Failed: ${
            response.data.Message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Full CBK Auth Error:", {
        message: error.message,
        response: error.response?.data,
        config: {
          url: error.config?.url,
          data: error.config?.data,
        },
      });
      throw new Error(`Error getting access token: ${error.message}`);
    }
  },
  initiatePayment: async (req, res, next) => {
    try {
      const { amount, description, paymentType } = req.body;
      const trackId = `TRACK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const accessToken = await getAccessToken();

      const paymentData = {
        tij_MerchantEncryptCode: process.env.CBK_ENCRYPT_KEY,
        tij_MerchAuthKeyApi: accessToken,
        tij_MerchantPaymentLang: "EN",
        tij_MerchantPaymentAmount: amount,
        tij_MerchantPaymentTrack: trackId,
        tij_MerchReturnUrl: `${req.headers.origin}/payment-result`,
        tij_MerchantPaymentRef: description || "Payment",
        tij_MerchPayType: paymentType || "1", // 1 for KNET, 2 for TPAY
        tij_MerchantPaymentCurrency: "KWD",
      };

      res.json({
        paymentUrl: `${process.env.CBK_TEST_URL}/payment?${new URLSearchParams(
          paymentData
        ).toString()}`,
        trackId,
      });
    } catch (error) {
      console.error("Payment creation error:", error);
      res
        .status(500)
        .json({ message: "Payment creation failed", error: error.message });
    }
  },
  verifyPayment: async (req, res) => {
    try {
      const { encrp, trackId } = req.body;
      const accessToken = await getAccessToken();

      let verifyUrl;
      if (encrp) {
        verifyUrl = `${process.env.CBK_TEST_URL}/api/verify?encrp=${encrp}&_v=${accessToken}`;
      } else if (trackId) {
        verifyUrl = `${process.env.CBK_TEST_URL}/api/verify`;
      } else {
        return res
          .status(400)
          .json({ message: "Either encrp or trackId is required" });
      }

      const response = await axios.get(verifyUrl, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.CBK_CLIENT_ID}:${process.env.CBK_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      });

      res.json(response.data);
    } catch (error) {
      console.error("Payment verification error:", error);
      res
        .status(500)
        .json({ message: "Payment verification failed", error: error.message });
    }
  },
  // --- NEW: Create Checkout Session Endpoint ---
};
module.exports = orderController;
