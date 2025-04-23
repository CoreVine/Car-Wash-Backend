const AdRepository = require('../data-access/ads');
const { createPagination } = require('../utils/responseHandler');
const { getRelativePath } = require("../utils/fileUtils");
const { deleteUploadedFile } = require('../config/multer.config');
const loggingService = require('../services/logging.service');
const logger = loggingService.getLogger();
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError
} = require('../utils/errors/types/Api.error');

const adController = {
  createAd: async (req, res, next) => {
    try {
      // Check if user is super-admin
      if (!req.adminEmployee || req.adminEmployee.role !== 'super-admin') {
        throw new ForbiddenError('Only super-admin can create ads');
      }

      const { name } = req.body;

      // Check if ad with same name already exists
      const adExists = await AdRepository.findByName(name);
      if (adExists) {
        throw new BadRequestError('Ad with this name already exists');
      }

      // Check if file is uploaded
      if (!req.file) {
        throw new BadRequestError('Image is required');
      }

      // Create relative path for the image
      const imageUrl = getRelativePath(req.file.path, 'ads');

      // Create new ad
      const ad = await AdRepository.create({
        name,
        image_url: imageUrl
      });

      return res.success('Ad created successfully', ad);
    } catch (error) {
      // Clean up uploaded file if error occurs
      if (req.file && req.file.path) {
        await deleteUploadedFile(getRelativePath(req.file.path));
      }
      next(error);
    }
  },

  getAllAds: async (req, res, next) => {
    try {
      const ads = await AdRepository.findAllAds();
      return res.success('Ads retrieved successfully', ads);
    } catch (error) {
      next(error);
    }
  },

  getAd: async (req, res, next) => {
    try {
      const { adId } = req.params;

      const ad = await AdRepository.findById(adId);

      if (!ad) {
        throw new NotFoundError('Ad not found');
      }

      return res.success('Ad retrieved successfully', ad);
    } catch (error) {
      next(error);
    }
  },

  updateAd: async (req, res, next) => {
    try {
      // Check if user is super-admin
      if (!req.adminEmployee || req.adminEmployee.role !== 'super-admin') {
        throw new ForbiddenError('Only super-admin can update ads');
      }

      const { adId } = req.params;
      const { name } = req.body;

      const ad = await AdRepository.findById(adId);

      if (!ad) {
        throw new NotFoundError('Ad not found');
      }

      // If name is being updated, check if it's already used
      if (name && name !== ad.name) {
        const nameIsUnique = await AdRepository.isNameUnique(name, adId);
        if (!nameIsUnique) {
          throw new BadRequestError('Ad with this name already exists');
        }
      }

      // Update data
      const updateData = {};
      if (name) updateData.name = name;

      // If new image is uploaded
      if (req.file) {
        // Delete old image
        if (ad.image_url) {
          await deleteUploadedFile(ad.image_url);
        }
        updateData.image_url = getRelativePath(req.file.path, 'ads');
      }

      await AdRepository.update(adId, updateData);
      const updatedAd = await AdRepository.findById(adId);

      return res.success('Ad updated successfully', updatedAd);
    } catch (error) {
      // Clean up uploaded file if error occurs
      if (req.file && req.file.path) {
        await deleteUploadedFile(getRelativePath(req.file.path));
      }
      next(error);
    }
  },

  deleteAd: async (req, res, next) => {
    try {
      // Check if user is super-admin
      if (!req.adminEmployee || req.adminEmployee.role !== 'super-admin') {
        throw new ForbiddenError('Only super-admin can delete ads');
      }

      const { adId } = req.params;

      const ad = await AdRepository.findById(adId);

      if (!ad) {
        throw new NotFoundError('Ad not found');
      }

      // Delete image file
      if (ad.image_url) {
        await deleteUploadedFile(ad.image_url);
      }

      // Delete ad from database
      await AdRepository.delete(adId);

      return res.success('Ad deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adController;
