const WashTypeRepository = require("../data-access/wash-types");
const CompanyRepository = require("../data-access/companies");
const { createPagination } = require("../utils/responseHandler");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors/types/Api.error");

const washTypeController = {
  // Get all wash types
  getAllWashTypes: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const minPrice = req.query.min_price
        ? parseInt(req.query.min_price)
        : null;
      const maxPrice = req.query.max_price
        ? parseInt(req.query.max_price)
        : null;

      // Get wash types with price filtering if needed
      let result;
      if (minPrice !== null || maxPrice !== null) {
        result = await WashTypeRepository.findByPriceRange(minPrice, maxPrice, {
          limit,
          offset: (page - 1) * limit,
          order: [["price", "ASC"]],
        });

        // Count total for pagination
        const count = await WashTypeRepository.count({
          where: {
            ...(minPrice !== null && { price: { [Op.gte]: minPrice } }),
            ...(maxPrice !== null && { price: { [Op.lte]: maxPrice } }),
          },
        });

        result = {
          count,
          rows: result,
        };
      } else {
        // Use standard paginated query

        result = await WashTypeRepository.findAll(page, limit, {
          order: [["price", "ASC"]],
        });
      }

      const pagination = createPagination(page, limit, result.count);

      return res.success(
        "Wash types retrieved successfully",
        result.rows,
        pagination
      );
    } catch (error) {
      next(error);
    }
  },

  // Get wash types for a company
  getCompanyWashTypes: async (req, res, next) => {
    try {
      const { companyId } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      // Check if company exists
      const company = await CompanyRepository.findById(companyId);

      if (!company) {
        throw new NotFoundError("Company not found");
      }

      // Use repository method with pagination
      const { count, rows } = await WashTypeRepository.findByCompanyPaginated(
        companyId,
        page,
        limit
      );

      const pagination = createPagination(page, limit, count);

      return res.success(
        "Company wash types retrieved successfully",
        rows,
        pagination
      );
    } catch (error) {
      next(error);
    }
  },

  // Add a new wash type
  addWashType: async (req, res, next) => {
    try {
      const { name, price, description } = req.body;

      // Only company can add wash types
      if (!req.company) {
        throw new ForbiddenError("Only companies can add wash types");
      }

      // Create wash type
      const washType = await WashTypeRepository.create({
        name,
        price,
        description,
        company_id: req.company.company_id,
      });

      return res.success("Wash type added successfully", washType);
    } catch (error) {
      next(error);
    }
  },

  // Update a wash type
  updateWashType: async (req, res, next) => {
    try {
      const { typeId } = req.params;
      const { name, price, description } = req.body;

      // Find wash type
      const washType = await WashTypeRepository.findById(typeId);

      if (!washType) {
        throw new NotFoundError("Wash type not found");
      }

      // Check if wash type belongs to this company
      if (washType.company_id !== req.company.company_id) {
        throw new ForbiddenError(
          "You do not have permission to update this wash type"
        );
      }

      // Update wash type
      await WashTypeRepository.update(typeId, {
        name,
        price,
        description,
      });

      // Get updated wash type
      const updatedWashType = await WashTypeRepository.findById(typeId);

      return res.success("Wash type updated successfully", updatedWashType);
    } catch (error) {
      next(error);
    }
  },

  // Delete a wash type
  deleteWashType: async (req, res, next) => {
    try {
      const { typeId } = req.params;

      // Find wash type
      const washType = await WashTypeRepository.findById(typeId);

      if (!washType) {
        throw new NotFoundError("Wash type not found");
      }

      // Check if wash type belongs to this company
      if (washType.company_id !== req.company.company_id) {
        throw new ForbiddenError(
          "You do not have permission to delete this wash type"
        );
      }

      // Check if wash type is being used in any orders
      const washOrders = await washType.getWashOrders();

      if (washOrders.length > 0) {
        throw new BadRequestError(
          "Cannot delete wash type that is being used in orders"
        );
      }

      // Delete wash type
      await WashTypeRepository.delete(typeId);

      return res.success("Wash type deleted successfully");
    } catch (error) {
      next(error);
    }
  },

  // Get popular wash types
  getPopularWashTypes: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit, 10) || 5;

      const popularWashTypes = await WashTypeRepository.findPopularWashTypes(
        limit
      );

      return res.success(
        "Popular wash types retrieved successfully",
        popularWashTypes
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = washTypeController;
