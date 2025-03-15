const Yup = require("yup");
// Import repositories
import CustomerCarRepository from "../data-access/customer-cars";
import CarWashOrderRepository from "../data-access/car-wash-orders";
import OrderRepository from "../data-access/orders";
import OrderStatusHistoryRepository from "../data-access/order-status-histories";

const { createPagination } = require("../utils/responseHandler");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError
} = require("../utils/errors/types/Api.error");

const customerCarController = {
  addCustomerCar: async (req, res, next) => {
    try {
      const { model, car_plate_number } = req.body;
      
      // Check if car with this plate number already exists for this user
      const existingCar = await CustomerCarRepository.findOne({
        where: {
          car_plate_number,
          customer_id: req.user.user_id
        }
      });
      
      if (existingCar) {
        throw new BadRequestError('Car with this plate number already exists');
      }
      
      // Create new customer car
      const customerCar = await CustomerCarRepository.create({
        model,
        car_plate_number,
        customer_id: req.user.user_id
      });

      return res.success('Car added successfully', customerCar);
    } catch (error) {
      next(error);
    }
  },
  
  getCustomerCars: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      
      // Use new repository method
      const { count, rows } = await CustomerCarRepository.findCustomerCarsPaginated(req.user.user_id, page, limit);
      
      const pagination = createPagination(page, limit, count);

      return res.success('Customer cars retrieved successfully', rows, pagination);
    } catch (error) {
      next(error);
    }
  },
  
  getCustomerCar: async (req, res, next) => {
    try {
      const { carId } = req.params;
      
      // Use new repository method to get car with wash history
      const customerCar = await CustomerCarRepository.findCarWithWashHistory(carId);
      
      if (!customerCar) {
        throw new NotFoundError('Car not found');
      }
      
      // Check if the user has permission to view this car
      if (customerCar.customer_id !== req.userId && !req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to view this car');
      }

      return res.success('Car retrieved successfully', customerCar);
    } catch (error) {
      next(error);
    }
  },
  
  updateCustomerCar: async (req, res, next) => {
    try {
      const { carId } = req.params;
      
      const customerCar = await CustomerCarRepository.findById(carId);
      
      if (!customerCar) {
        throw new NotFoundError('Car not found');
      }
      
      // Check if the user owns this car
      if (customerCar.customer_id !== req.user.user_id) {
        throw new ForbiddenError('You do not have permission to update this car');
      }
      
      // If plate number is being changed, check if it already exists
      if (req.body.car_plate_number && req.body.car_plate_number !== customerCar.car_plate_number) {
        const existingCar = await CustomerCarRepository.findByPlateNumber(req.body.car_plate_number);
        
        if (existingCar && existingCar.customer_id === req.user.user_id) {
          throw new BadRequestError('Car with this plate number already exists');
        }
      }
      
      // Update car
      await CustomerCarRepository.update(carId, req.body);
      const updatedCar = await CustomerCarRepository.findById(carId);

      return res.success('Car updated successfully', updatedCar);
    } catch (error) {
      next(error);
    }
  },
  
  deleteCustomerCar: async (req, res, next) => {
    try {
      const { carId } = req.params;
      
      const customerCar = await CustomerCarRepository.findById(carId);
      
      if (!customerCar) {
        throw new NotFoundError('Car not found');
      }
      
      // Check if the user owns this car
      if (customerCar.customer_id !== req.user.user_id) {
        throw new ForbiddenError('You do not have permission to delete this car');
      }
      
      // Use new repository method to check for active wash orders
      const hasActiveOrders = await CustomerCarRepository.hasActiveWashOrders(carId);
      
      if (hasActiveOrders) {
        throw new BadRequestError('Cannot delete car with active wash orders');
      }
      
      // Delete the car
      await CustomerCarRepository.delete(carId);

      return res.success('Car deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = customerCarController;
