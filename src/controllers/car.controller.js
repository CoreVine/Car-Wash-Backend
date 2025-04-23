const { Op } = require("sequelize");
const path = require("path");
// Import repositories
import CarRepository from "../data-access/cars";
import RentalCarImageRepository from "../data-access/rental-car-images";
import RentalOrderRepository from "../data-access/rental-orders";
import CompanyExhibitionRepository from "../data-access/company-exhibitions";
import CompanyRepository from "../data-access/companies";
import CarBrandRepository from "../data-access/car-brands";
// Remove AWS service import
const { createPagination } = require("../utils/responseHandler");
const { getRelativePath } = require("../utils/fileUtils");
const loggingService = require("../services/logging.service");
const logger = loggingService.getLogger();
const multerConfig = require("../config/multer.config");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError
} = require("../utils/errors/types/Api.error");

const carController = {
  addCar: async (req, res, next) => {
    try {
      const { 
        model, 
        year, 
        price, 
        exhibition_id, 
        carbrand_id, 
        description, 
        sale_or_rental 
      } = req.body;
      
      if (!['sale', 'rent'].includes(sale_or_rental)) {
        throw new BadRequestError('Invalid value for sale_or_rental. Must be "sale" or "rent"');
      }
      
      // Verify exhibition belongs to this company
      const exhibition = await CompanyExhibitionRepository.findOne({
        where: {
          exhibition_id,
          company_id: req.company.company_id
        }
      });
      
      if (!exhibition) {
        throw new BadRequestError('Exhibition not found or does not belong to your company');
      }
      
      // Verify brand exists
      const brand = await CarBrandRepository.findById(carbrand_id);
      
      if (!brand) {
        throw new BadRequestError('Car brand not found');
      }

      // Create the car
      const car = await CarRepository.create({
        model,
        year,
        price,
        exhibition_id,
        carbrand_id,
        company_id: req.company.company_id,
        description,
        sale_or_rental
      });

      return res.success('Car added successfully', car);
    } catch (error) {
      next(error);
    }
  },
  
  getCars: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      
      // Use new repository method with filters
      const { count, rows } = await CarRepository.findCarsWithFilters({
        page,
        limit,
        company_id: req.query.company_id,
        exhibition_id: req.query.exhibition_id,
        carbrand_id: req.query.brand_id, // Add brand filtering
        min_price: req.query.min_price,
        max_price: req.query.max_price,
        min_year: req.query.min_year,
        max_year: req.query.max_year,
        search: req.query.search,
        available_from: req.query.available_from,
        available_to: req.query.available_to,
        only_available: !!req.query.only_available,
        sale_or_rental: req.query.type // 'sale' or 'rent'
      });

      const pagination = createPagination(page, limit, count);

      return res.success('Cars retrieved successfully', rows, pagination);
    } catch (error) {
      next(error);
    }
  },
  
  getCar: async (req, res, next) => {
    try {
      const { carId } = req.params;
      
      // Use new repository method for detailed car info
      const car = await CarRepository.findCarWithFullDetailsUser(carId);

      if (!car) {
        throw new NotFoundError('Car not found');
      }

      return res.success('Car retrieved successfully', car);
    } catch (error) {
      next(error);
    }
  },
  
  updateCar: async (req, res, next) => {
    try {
      const { carId } = req.params;
      
      // Validate sale_or_rental if provided
      if (req.body.sale_or_rental && !['sale', 'rent'].includes(req.body.sale_or_rental)) {
        throw new BadRequestError('Invalid value for sale_or_rental. Must be "sale" or "rent"');
      }
      
      const car = await CarRepository.findByPk(carId);
      
      if (!car) {
        throw new NotFoundError('Car not found');
      }
      
      // Check if the car belongs to the company
      if (car.company_id !== req.company.company_id) {
        throw new ForbiddenError('You do not have permission to update this car');
      }
      
      // If exhibition is being changed, verify it belongs to this company
      if (req.body.exhibition_id && req.body.exhibition_id !== car.exhibition_id) {
        const exhibition = await CompanyExhibitionRepository.findOne({
          where: {
            exhibition_id: req.body.exhibition_id,
            company_id: req.company.company_id
          }
        });
        
        if (!exhibition) {
          throw new BadRequestError('Exhibition not found or does not belong to your company');
        }
      }
      
      // If brand is being changed, verify it exists
      if (req.body.carbrand_id && req.body.carbrand_id !== car.carbrand_id) {
        const brand = await CarBrandRepository.findById(req.body.carbrand_id);
        
        if (!brand) {
          throw new BadRequestError('Car brand not found');
        }
      }
      
      // Update car
      await car.update(req.body);
      
      // Get updated car with related data
      const updatedCar = await CarRepository.findWithImages(carId);

      return res.success('Car updated successfully', updatedCar);
    } catch (error) {
      next(error);
    }
  },
  
  deleteCar: async (req, res, next) => {
    try {
      const { carId } = req.params;
      
      const car = await CarRepository.findById(carId);
      
      if (!car) {
        throw new NotFoundError('Car not found');
      }
      
      // Check if the car belongs to the company
      if (car.company_id !== req.company.company_id) {
        throw new ForbiddenError('You do not have permission to delete this car');
      }
      
      // Check if car has active rentals using new repository method
      const hasActiveRentals = await CarRepository.hasActiveRentals(carId);
      
      if (hasActiveRentals) {
        throw new BadRequestError('Cannot delete car with active rentals');
      }
      
      // Get all car images
      const images = await RentalCarImageRepository.findByCarId(carId);
      
      // Delete images from storage
      for (const image of images) {
        try {
          await multerConfig.deleteUploadedFile(image.image_url);
        } catch (err) {
          console.log(`Error deleting image from storage: ${err.message}`);
        }
      }
      
      // Delete the car (cascades to images)
      await CarRepository.delete(carId);

      return res.success('Car deleted successfully');
    } catch (error) {
      next(error);
    }
  },
  
  addCarImage: async (req, res, next) => {
    try {
      const { carId } = req.params;
      
      if (!req.file) {
        throw new BadRequestError('No image uploaded');
      }
      
      const car = await CarRepository.findByPk(carId);
      
      if (!car) {
        throw new NotFoundError('Car not found');
      }
      
      // Check if the car belongs to the company
      if (car.company_id !== req.company.company_id) {
        throw new ForbiddenError('You do not have permission to update this car');
      }
      
      // Create a relative path for public access
      const relativePath = getRelativePath(req.file.path, 'car-images');
      
      // Create image record in database with relative path
      const image = await RentalCarImageRepository.create({
        car_id: carId,
        image_url: relativePath
      });

      return res.success('Image uploaded successfully', image);
    } catch (error) {
      next(error);
    }
  },
  
  deleteCarImage: async (req, res, next) => {
    try {
      const { carId, imageId } = req.params;
      
      const image = await RentalCarImageRepository.findOne({
        where: { 
          image_id: imageId,
          car_id: carId
        },
        include: [{
          model: Car,
          as: 'car'
        }]
      });
      
      if (!image) {
        throw new NotFoundError('Image not found');
      }
      
      // Check if the car belongs to the company
      if (image.car.company_id !== req.company.company_id) {
        throw new ForbiddenError('You do not have permission to delete this image');
      }
      
      // Delete file from storage
      try {
        await multerConfig.deleteUploadedFile(image.image_url);
      } catch (err) {
        console.log(`Error deleting image from storage: ${err.message}`);
      }
      
      // Delete from database
      await image.destroy();

      return res.success('Image deleted successfully');
    } catch (error) {
      next(error);
    }
  },
  
  addExhibition: async (req, res, next) => {
    try {
      const { location } = req.body;
      
      const exhibition = await CompanyExhibitionRepository.create({
        location,
        company_id: req.company.company_id
      });

      return res.success('Exhibition added successfully', exhibition);
    } catch (error) {
      next(error);
    }
  },
  
  getExhibitions: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      // Use new repository method
      const { count, rows } = await CompanyExhibitionRepository.findExhibitionsWithFullDetails(page, limit);

      const pagination = createPagination(page, limit, count);

      return res.success('Exhibitions retrieved successfully', rows, pagination);
    } catch (error) {
      next(error);
    }
  },
  
  getCompanyExhibitions: async (req, res, next) => {
    try {
      const { companyId } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      
      // Use new repository method
      const { count, rows } = await CompanyExhibitionRepository.findCompanyExhibitionsPaginated(companyId, page, limit);
      
      const pagination = createPagination(page, limit, count);

      return res.success('Company exhibitions retrieved successfully', rows, pagination);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = carController;
