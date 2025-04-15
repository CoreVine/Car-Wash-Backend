const CarBrandRepository = require("../data-access/car-brands");
const { createPagination } = require("../utils/responseHandler");
const awsService = require("../services/aws.service");
const {
  BadRequestError,
  NotFoundError
} = require("../utils/errors/types/Api.error");

const carBrandController = {
  getAllBrands: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || null;
      
      const { count, rows } = await CarBrandRepository.findBrandsPaginated(page, limit, search);
      
      const pagination = createPagination(page, limit, count);
      
      return res.success('Car brands retrieved successfully', rows, pagination);
    } catch (error) {
      next(error);
    }
  },
  
  getBrandById: async (req, res, next) => {
    try {
      const { brandId } = req.params;
      
      const brand = await CarBrandRepository.findById(brandId);
      
      if (!brand) {
        throw new NotFoundError('Car brand not found');
      }
      
      return res.success('Car brand retrieved successfully', brand);
    } catch (error) {
      next(error);
    }
  },
  
  getBrandWithCars: async (req, res, next) => {
    try {
      const { brandId } = req.params;
      
      const brand = await CarBrandRepository.findBrandWithCars(brandId);
      
      if (!brand) {
        throw new NotFoundError('Car brand not found');
      }
      
      return res.success('Car brand with cars retrieved successfully', brand);
    } catch (error) {
      next(error);
    }
  },
  
  createBrand: async (req, res, next) => {
    try {
      const { name } = req.body;
      
      if (!req.file) {
        throw new BadRequestError('Brand logo is required');
      }
      
      // Check if brand with the same name already exists
      const existingBrand = await CarBrandRepository.findByName(name);
      
      if (existingBrand) {
        throw new BadRequestError(`A brand with name "${name}" already exists`);
      }
      
      // Get file extension
      const fileExt = req.file.originalname.split('.').pop();
      
      // Create the brand
      const brand = await CarBrandRepository.create({
        name,
        logo: req.file.url || req.file.path.replace(/\\/g, '/').replace('public/', '/')
      });
      
      return res.success('Car brand created successfully', brand);
    } catch (error) {
      next(error);
    }
  },
  
  updateBrand: async (req, res, next) => {
    try {
      const { brandId } = req.params;
      const { name } = req.body;
      
      const brand = await CarBrandRepository.findById(brandId);
      
      if (!brand) {
        throw new NotFoundError('Car brand not found');
      }
      
      // Check if another brand with the same name exists
      if (name && name !== brand.name) {
        const existingBrand = await CarBrandRepository.findByName(name);
        
        if (existingBrand && existingBrand.brand_id !== parseInt(brandId)) {
          throw new BadRequestError(`A brand with name "${name}" already exists`);
        }
      }
      
      // If there's a new logo, update it
      if (req.file) {
        // Delete old logo from S3
        const oldLogo = brand.logo;
        const fileExt = oldLogo.split('.').pop();
        const fileUUID = oldLogo.split('.')[0];
        
        try {
          await awsService.deleteFile(fileUUID, fileExt, 'brand-logos/');
        } catch (err) {
          console.log(`Error deleting logo from S3: ${err.message}`);
        }
        
        // Upload new logo
        const newFileExt = req.file.originalname.split('.').pop();
        const uuid = await awsService.uploadFile(req.file, newFileExt, 'brand-logos/');
        
        // Update the brand with new logo
        await brand.update({
          name: name || brand.name,
          logo: `${uuid}.${newFileExt}`
        });
      } else {
        // Update just the name
        await brand.update({
          name: name || brand.name
        });
      }
      
      return res.success('Car brand updated successfully', brand);
    } catch (error) {
      next(error);
    }
  },
  
  deleteBrand: async (req, res, next) => {
    try {
      const { brandId } = req.params;
      
      const brand = await CarBrandRepository.findById(brandId);
      
      if (!brand) {
        throw new NotFoundError('Car brand not found');
      }
      
      // Check if there are cars using this brand
      const cars = await brand.getCars();
      
      if (cars && cars.length > 0) {
        throw new BadRequestError('Cannot delete brand that is associated with cars');
      }
      
      // Delete logo from S3
      const logo = brand.logo;
      const fileExt = logo.split('.').pop();
      const fileUUID = logo.split('.')[0];
      
      try {
        await awsService.deleteFile(fileUUID, fileExt, 'brand-logos/');
      } catch (err) {
        console.log(`Error deleting logo from S3: ${err.message}`);
      }
      
      // Delete the brand
      await CarBrandRepository.delete(brandId);
      
      return res.success('Car brand deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = carBrandController;
