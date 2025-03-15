const { Op, literal } = require("sequelize");
// Import repositories
import OrderRepository from "../data-access/orders";
import OrderItemRepository from "../data-access/order-items";
import OrderStatusHistoryRepository from "../data-access/order-status-histories";
import CarWashOrderRepository from "../data-access/car-wash-orders";
import RentalOrderRepository from "../data-access/rental-orders";
import ProductRepository from "../data-access/products";
import CompanyRepository from "../data-access/companies";
import CustomerCarRepository from "../data-access/customer-cars";
import CarRepository from "../data-access/cars";
import UserRepository from "../data-access/users";
import EmployeeRepository from "../data-access/employees";
import WashOrderOperationRepository from "../data-access/wash-order-operations";
import PaymentMethodRepository from "../data-access/payment-methods";
const { createPagination } = require("../utils/responseHandler");
const loggingService = require("../services/logging.service");
const logger = loggingService.getLogger();
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError
} = require("../utils/errors/types/Api.error");

const orderController = {
  createOrder: async (req, res, next) => {
    try {
      const { order_type, items, car_id, wash_operations, payment_method_id } = req.body;

      // Verify payment method exists
      const paymentMethod = await PaymentMethodRepository.findById(payment_method_id);

      if (!paymentMethod) {
        throw new BadRequestError('Payment method not found');
      }

      // Create order
      const order = await OrderRepository.create({
        user_id: req.userId,
        order_type,
        payment_method_id,
        total_amount: 0 // Will be updated later
      });

      let totalAmount = 0;

      if (order_type === 'product') {
        // Prepare order items for bulk creation
        const orderItems = [];
        
        // Verify items and calculate total amount
        for (const item of items) {
          const product = await ProductRepository.findById(item.product_id);

          if (!product) {
            throw new BadRequestError(`Product with ID ${item.product_id} not found`);
          }

          const itemTotal = product.price * item.quantity;
          totalAmount += itemTotal;

          orderItems.push({
            order_id: order.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            total_price: itemTotal
          });
        }
        
        // Use the new repository method for bulk creation
        await OrderItemRepository.createOrderItems(orderItems);
      } else if (order_type === 'wash') {
        // Verify car exists
        const car = await CustomerCarRepository.findById(car_id);

        if (!car) {
          throw new BadRequestError('Car not found');
        }

        // Verify wash operations and calculate total amount
        for (const operationId of wash_operations) {
          const operation = await WashOrderOperationRepository.findById(operationId);

          if (!operation) {
            throw new BadRequestError(`Wash operation with ID ${operationId} not found`);
          }

          totalAmount += operation.price;
        }

        // Create car wash order
        await CarWashOrderRepository.create({
          order_id: order.order_id,
          car_id
        });

        // Create wash order operations
        for (const operationId of wash_operations) {
          await WashOrderOperationRepository.create({
            car_wash_order_id: order.order_id,
            operation_id: operationId
          });
        }
      }

      // Update order total amount
      await OrderRepository.update(order.order_id, { total_amount: totalAmount });

      // Create initial order status history
      await OrderStatusHistoryRepository.addOrderStatusHistory(order.order_id, 'pending');

      // Get complete order with items
      const completeOrder = await OrderRepository.findWithDetails(order.order_id);

      return res.success('Order created successfully', completeOrder);
    } catch (error) {
      next(error);
    }
  },

  getOrders: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      // Use the new repository method
      const { count, rows } = await OrderRepository.findUserOrdersPaginated(req.userId, page, limit);

      const pagination = createPagination(page, limit, count);

      return res.success('Orders retrieved successfully', rows, pagination);
    } catch (error) {
      next(error);
    }
  },

  getOrder: async (req, res, next) => {
    try {
      const { orderId } = req.params;

      // Use the existing repository method which already abstracts the query
      const order = await OrderRepository.findWithDetails(orderId);

      if (!order) {
        throw new NotFoundError('Order not found');
      }

      return res.success('Order retrieved successfully', order);
    } catch (error) {
      next(error);
    }
  },

  updateOrderStatus: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { status, notes } = req.body;

      const order = await OrderRepository.findById(orderId);

      if (!order) {
        throw new NotFoundError('Order not found');
      }

      // Update order status
      await OrderRepository.update(orderId, { status });

      // Create order status history using the new repository method
      await OrderStatusHistoryRepository.addOrderStatusHistory(orderId, status, notes);

      return res.success('Order status updated successfully');
    } catch (error) {
      next(error);
    }
  },

  createWashOrder: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { car_id, wash_operations } = req.body;

      const order = await OrderRepository.findById(orderId);

      if (!order) {
        throw new NotFoundError('Order not found');
      }

      // Verify this is a wash order
      if (order.order_type !== 'wash') {
        throw new BadRequestError('Order is not of type wash');
      }

      // Check if wash order already exists for this order
      const existingWashOrder = await CarWashOrderRepository.findOne({
        where: { order_id: orderId }
      });

      if (existingWashOrder) {
        throw new BadRequestError('Wash order already exists for this order');
      }

      // Verify car exists
      const car = await CustomerCarRepository.findById(car_id);

      if (!car) {
        throw new BadRequestError('Car not found');
      }

      // Verify wash operations and calculate total amount
      let totalAmount = 0;
      for (const operationId of wash_operations) {
        const operation = await WashOrderOperationRepository.findById(operationId);

        if (!operation) {
          throw new BadRequestError(`Wash operation with ID ${operationId} not found`);
        }

        totalAmount += operation.price;
      }

      // Create car wash order
      const carWashOrder = await CarWashOrderRepository.create({
        order_id: orderId,
        car_id
      });

      // Create wash order operations
      for (const operationId of wash_operations) {
        await WashOrderOperationRepository.create({
          car_wash_order_id: carWashOrder.car_wash_order_id,
          operation_id: operationId
        });
      }

      // Update order total amount
      await OrderRepository.update(orderId, { total_amount: totalAmount });

      // Get complete wash order
      const completeWashOrder = await CarWashOrderRepository.findById(carWashOrder.car_wash_order_id, {
        include: [
          {
            model: Order,
            as: 'order'
          },
          {
            model: CustomerCar,
            as: 'car'
          },
          {
            model: WashOrderOperation,
            as: 'operations'
          }
        ]
      });

      return res.success('Wash order created successfully', completeWashOrder);
    } catch (error) {
      next(error);
    }
  },

  createRentalOrder: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { car_id, start_date, end_date } = req.body;
      
      const order = await OrderRepository.findById(orderId);
      
      if (!order) {
        throw new NotFoundError('Order not found');
      }
      
      // Verify this is a rental order
      if (order.order_type !== 'rental') {
        throw new BadRequestError('Order is not of type rental');
      }
      
      // Check if rental order already exists for this order
      const existingRentalOrder = await RentalOrderRepository.findOne({
        where: { order_id: orderId }
      });
      
      if (existingRentalOrder) {
        throw new BadRequestError('Rental order already exists for this order');
      }
      
      // Verify the car exists and belongs to the company
      const car = await CarRepository.findOne({
        where: {
          car_id,
          company_id: order.company_id
        }
      });
      
      if (!car) {
        throw new BadRequestError('Car not found or does not belong to the company');
      }
      
      // Check if car is available for the requested dates
      const overlappingRentals = await RentalOrderRepository.count({
        where: {
          car_id,
          [Op.or]: [
            {
              [Op.and]: [
                { start_date: { [Op.lte]: start_date } },
                { end_date: { [Op.gte]: start_date } }
              ]
            },
            {
              [Op.and]: [
                { start_date: { [Op.lte]: end_date } },
                { end_date: { [Op.gte]: end_date } }
              ]
            },
            {
              [Op.and]: [
                { start_date: { [Op.gte]: start_date } },
                { end_date: { [Op.lte]: end_date } }
              ]
            }
          ]
        }
      });
      
      if (overlappingRentals > 0) {
        throw new BadRequestError('Car is not available for the requested dates');
      }
      
      // Calculate rental duration in days
      const startDateTime = new Date(start_date).getTime();
      const endDateTime = new Date(end_date).getTime();
      const durationMs = endDateTime - startDateTime;
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
      
      // Calculate total price
      const totalPrice = car.price_per_day * durationDays;
      
      // Create rental order
      const rentalOrder = await RentalOrderRepository.create({
        order_id: orderId,
        car_id,
        start_date,
        end_date
      });
      
      // Update order total
      await OrderRepository.update(orderId, { total_amount: totalPrice });
      
      // Get complete rental order
      const completeRentalOrder = await RentalOrderRepository.findById(rentalOrder.rental_order_id, {
        include: [
          {
            model: Order,
            as: 'order'
          },
          {
            model: Car,
            as: 'car',
            include: [{
              model: RentalCarImage,
              as: 'images'
            }]
          }
        ]
      });

      return res.success('Rental order created successfully', completeRentalOrder);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;