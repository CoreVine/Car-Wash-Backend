const CarBrandRepository = require("../data-access/car-brands");
const { createPagination } = require("../utils/responseHandler");
const { getRelativePath } = require("../utils/fileUtils");
const multerConfig = require("../config/multer.config");
const {
  BadRequestError,
  NotFoundError,
} = require("../utils/errors/types/Api.error");

const carBrandController = {
  getAllBrands: async (req, res, next) => {
    try {
      const search = req.query.search || null;
      const rows = await CarBrandRepository.findBrands(search);

      return res.success("Car brands retrieved successfully", rows);
    } catch (error) {
      next(error);
    }
  },

  getBrandById: async (req, res, next) => {
    try {
      const { brandId } = req.params;

      const brand = await CarBrandRepository.findById(brandId);

      if (!brand) {
        throw new NotFoundError("Car brand not found");
      }

      return res.success("Car brand retrieved successfully", brand);
    } catch (error) {
      next(error);
    }
  },

  getBrandWithCars: async (req, res, next) => {
    try {
      const { brandId } = req.params;

      const brand = await CarBrandRepository.findBrandWithCars(brandId);

      if (!brand) {
        throw new NotFoundError("Car brand not found");
      }

      return res.success("Car brand with cars retrieved successfully", brand);
    } catch (error) {
      next(error);
    }
  },

  createBrand: async (req, res, next) => {
    try {
      const { name } = req.body;

      if (!req.file) {
        throw new BadRequestError("Brand logo is required");
      }

      // Check if brand with the same name already exists
      const existingBrand = await CarBrandRepository.findByName(name);

      if (existingBrand) {
        throw new BadRequestError(`A brand with name "${name}" already exists`);
      }

      // Create relative path for the logo
      const logoPath =
      req.file.url ||
      req.file.public_id ||
      getRelativePath(req.file.path, "subcategory-icons");
      
      // Create the brand
      const brand = await CarBrandRepository.create({
        name,
        logo: logoPath,
      });

      return res.success("Car brand created successfully", brand);
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
        throw new NotFoundError("Car brand not found");
      }

      // Check if another brand with the same name exists
      if (name && name !== brand.name) {
        const existingBrand = await CarBrandRepository.findByName(name);

        if (existingBrand && existingBrand.brand_id !== parseInt(brandId)) {
          throw new BadRequestError(
            `A brand with name "${name}" already exists`
          );
        }
      }

      // If there's a new logo, update it
      if (req.file) {
        // Delete old logo from storage
        if (brand.logo) {
          try {
            await multerConfig.deleteUploadedFile(brand.logo);
          } catch (err) {
            console.log(`Error deleting logo: ${err.message}`);
          }
        }

        // Create relative path for the new logo
        const logoPath = getRelativePath(req.file.path, "brand-logos");

        // Update the brand with new logo
        await brand.update({
          name: name || brand.name,
          logo: logoPath,
        });
      } else {
        // Update just the name
        await brand.update({
          name: name || brand.name,
        });
      }

      return res.success("Car brand updated successfully", brand);
    } catch (error) {
      next(error);
    }
  },

  deleteBrand: async (req, res, next) => {
    try {
      const { brandId } = req.params;

      const brand = await CarBrandRepository.findById(brandId);

      if (!brand) {
        throw new NotFoundError("Car brand not found");
      }

      // Check if there are cars using this brand
      const cars = await brand.getCars();

      if (cars && cars.length > 0) {
        throw new BadRequestError(
          "Cannot delete brand that is associated with cars"
        );
      }

      // Delete logo from storage
      if (brand.logo) {
        try {
          await multerConfig.deleteUploadedFile(brand.logo);
        } catch (err) {
          console.log(`Error deleting logo: ${err.message}`);
        }
      }

      // Delete the brand
      await CarBrandRepository.delete(brandId);

      return res.success("Car brand deleted successfully");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = carBrandController;
