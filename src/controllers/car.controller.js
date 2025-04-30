// Import repositories
import CarRepository from "../data-access/cars";
import RentalCarImageRepository from "../data-access/rental-car-images";
import CompanyExhibitionRepository from "../data-access/company-exhibitions";
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
      
      // Prepare image records if any files were uploaded
      const imageRecords = req.files && req.files.length > 0 
        ? req.files.map(file => ({
            image_url: getRelativePath(file.path, 'car-images')
          }))
        : [];
      
      // Use repository method that handles transaction internally
      const car = await CarRepository.createWithImagesAndValidation(
        { model, year, price, exhibition_id, carbrand_id, description, sale_or_rental },
        imageRecords,
        req.company.company_id
      );

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
      
      // Use the specialized repository method that handles all the checks
      const imagesToDelete = await CarRepository.safeDeleteWithImages(carId);
      
      // After successful DB deletion, delete the physical files
      for (const image of imagesToDelete) {
        try {
          await multerConfig.deleteUploadedFile(image.image_url);
        } catch (err) {
          logger.error(`Error deleting image file: ${image.image_url}`, err);
        }
      }

      return res.success('Car deleted successfully');
    } catch (error) {
      if (error.message === 'Cannot delete car with active rentals') {
        return next(new BadRequestError(error.message));
      }
      next(error);
    }
  },
  
  addCarImage: async (req, res, next) => {
    try {
      const { carId } = req.params;
      
      if (!req.files || req.files.length === 0) {
        throw new BadRequestError('No images uploaded');
      }
      
      const car = await CarRepository.findByPk(carId);
      
      if (!car) {
        throw new NotFoundError('Car not found');
      }
      
      // Check if the car belongs to the company
      if (car.company_id !== req.company.company_id) {
        throw new ForbiddenError('You do not have permission to update this car');
      }
      
      // Prepare image records
      const imageRecords = req.files.map(file => ({
        image_url: getRelativePath(file.path, 'car-images')
      }));
      
      // Use repository method to handle the transaction
      const uploadedImages = await RentalCarImageRepository.bulkCreateImagesForCar(carId, imageRecords);

      return res.success('Images uploaded successfully', uploadedImages);
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
      
      // Extract search parameters
      const filters = {
        page,
        limit,
        company_id: req.query.company_id,
        search: req.query.search,
        location: req.query.location
      };

      // Use enhanced repository method with filters
      const { count, rows } = await CompanyExhibitionRepository.findExhibitionsWithFilters(filters);

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
  },

  getExhibitionDetails: async (req, res, next) => {
    try {
      const { exhibitionId } = req.params;
      
      // Fetch exhibition with cars and preview images
      const exhibition = await CompanyExhibitionRepository.findExhibitionWithCarsAndPreviewImages(exhibitionId);
      
      if (!exhibition) {
        throw new NotFoundError('Exhibition not found');
      }

      return res.success('Exhibition details retrieved successfully', exhibition);
    } catch (error) {
      next(error);
    }
  },
  
  updateExhibition: async (req, res, next) => {
    try {
      const { exhibitionId } = req.params;
      const { location } = req.body;
      
      // Find the exhibition and verify ownership
      const exhibition = await CompanyExhibitionRepository.findById(exhibitionId);
      
      if (!exhibition) {
        throw new NotFoundError('Exhibition not found');
      }
      
      // Check if the exhibition belongs to the company
      if (exhibition.company_id !== req.company.company_id && !req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to update this exhibition');
      }
      
      // Update the exhibition
      await exhibition.update({ location });
      
      // Get updated exhibition with related data
      const updatedExhibition = await CompanyExhibitionRepository.findById(exhibitionId, {
        include: ['company']
      });

      return res.success('Exhibition updated successfully', updatedExhibition);
    } catch (error) {
      next(error);
    }
  },
  
  deleteExhibition: async (req, res, next) => {
    try {
      const { exhibitionId } = req.params;
      
      // Find the exhibition and verify ownership
      const exhibition = await CompanyExhibitionRepository.findById(exhibitionId);
      
      if (!exhibition) {
        throw new NotFoundError('Exhibition not found');
      }
      
      // Check if the exhibition belongs to the company
      if (exhibition.company_id !== req.company.company_id && !req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to delete this exhibition');
      }
      
      // Use the specialized repository method that performs cascading deletion
      const affectedCars = await CompanyExhibitionRepository.safeDeleteExhibition(exhibitionId);
      
      // Clean up image files for all deleted cars
      const deletePromises = [];
      
      for (const car of affectedCars) {
        if (car.images && car.images.length > 0) {
          car.images.forEach(image => {
            deletePromises.push(
              multerConfig.deleteUploadedFile(image.image_url)
                .catch(err => logger.error(`Error deleting image file: ${image.image_url}`, err))
            );
          });
        }
      }
      
      // Wait for all file deletions to complete
      await Promise.all(deletePromises);

      return res.success(`Exhibition deleted successfully with ${affectedCars.length} associated cars`);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = carController;
