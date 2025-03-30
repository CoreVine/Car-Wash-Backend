// Import repositories
import RatingRepository from "../data-access/ratings";
import CompanyRepository from "../data-access/companies";
import UserRepository from "../data-access/users";
const { createPagination } = require("../utils/responseHandler");
const {
  ForbiddenError,
  NotFoundError
} = require("../utils/errors/types/Api.error");

const ratingController = {
  addRating: async (req, res, next) => {
    try {
      const { company_id, rating_value, review_text } = req.body;
      
      // Verify company exists
      const company = await CompanyRepository.findById(company_id);
      
      if (!company) {
        throw new NotFoundError('Company not found');
      }
      
      // Check if user has already rated this company
      const existingRating = await RatingRepository.findOne({
        where: {
          company_id,
          user_id: req.user.user_id
        }
      });
      
      if (existingRating) {
        // Update existing rating
        await RatingRepository.update(existingRating.id, {
          rating_value,
          review_text,
          created_at: new Date()
        });
        
        const updatedRating = await RatingRepository.findOne({
          where: {
            company_id,
            user_id: req.user.user_id
          },
          include: [
            {
              model: UserRepository.model,
              as: 'user',
              attributes: ['user_id', 'name', 'username']
            },
            {
              model: CompanyRepository.model,
              as: 'company',
              attributes: ['company_id', 'company_name']
            }
          ]
        });
        
        // Calculate new average rating and update company
        const averageRating = await RatingRepository.getAverageRatingByCompany(company_id);
        await CompanyRepository.update(company_id, { total_rating: averageRating });
        
        return res.success('Rating updated successfully', updatedRating);
      }
      
      // Create new rating
      const rating = await RatingRepository.create({
        company_id,
        user_id: req.user.user_id,
        rating_value,
        review_text,
        created_at: new Date()
      });
      
      // Get complete rating with user and company details
      const completeRating = await RatingRepository.findOne({
        where: {
          company_id,
          user_id: req.user.user_id
        },
        include: [
          {
            model: UserRepository.model,
            as: 'user',
            attributes: ['user_id', 'name', 'username']
          },
          {
            model: CompanyRepository.model,
            as: 'company',
            attributes: ['company_id', 'company_name']
          }
        ]
      });

      // Calculate new average rating and update company
      const averageRating = await RatingRepository.getAverageRatingByCompany(company_id);
      await CompanyRepository.update(company_id, { total_rating: averageRating });

      return res.success('Rating added successfully', completeRating);
    } catch (error) {
      next(error);
    }
  },
  
  getCompanyRatings: async (req, res, next) => {
    try {
      const { companyId } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      
      // Verify company exists
      const company = await CompanyRepository.findById(companyId);
      
      if (!company) {
        throw new NotFoundError('Company not found');
      }
      
      // Use the new repository method instead of passing Sequelize options
      const { count, rows } = await RatingRepository.findCompanyRatingsPaginated(companyId, page, limit);
      
      // Calculate average rating
      const averageRating = await RatingRepository.getAverageRatingByCompany(companyId);
      
      const pagination = createPagination(page, limit, count);

      return res.success('Ratings retrieved successfully', {
        averageRating,
        ratings: rows
      }, pagination);
    } catch (error) {
      next(error);
    }
  },
  
  getUserRatings: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      
      // Only allow users to see their own ratings or admin
      if (parseInt(userId) !== req.userId && !req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to view these ratings');
      }
      
      // Use the new repository method
      const { count, rows } = await RatingRepository.findUserRatingsPaginated(userId, page, limit);
      
      const pagination = createPagination(page, limit, count);

      return res.success('User ratings retrieved successfully', rows, pagination);
    } catch (error) {
      next(error);
    }
  },
  
  deleteRating: async (req, res, next) => {
    try {
      const { companyId } = req.params;
      
      // Find the rating
      const rating = await RatingRepository.findOne({
        where: {
          company_id: companyId,
          user_id: req.user.user_id
        }
      });
      
      if (!rating) {
        throw new NotFoundError('Rating not found');
      }
      
      // Delete the rating
      await RatingRepository.destroy(rating.id);
      
      // Calculate new average rating and update company
      const averageRating = await RatingRepository.getAverageRatingByCompany(companyId);
      await CompanyRepository.update(companyId, { total_rating: averageRating || 0 });

      return res.success('Rating deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ratingController;
