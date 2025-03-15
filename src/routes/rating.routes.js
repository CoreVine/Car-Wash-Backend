const express = require("express");
const ratingController = require("../controllers/rating.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isUserMiddleware = require("../middlewares/isUser.middleware");
const validate = require("../middlewares/validation.middleware");
const Yup = require("yup");

// Define validation schema
const ratingSchema = Yup.object().shape({
    company_id: Yup.number().integer().positive().required(),
    rating_value: Yup.number().min(1).max(5).required(),
    review_text: Yup.string().required()
});

// Define param validation schemas
const companyIdParamSchema = Yup.object().shape({
  companyId: Yup.number().integer().positive().required()
});

const userIdParamSchema = Yup.object().shape({
  userId: Yup.number().integer().positive().required()
});

const ratingRoutes = express.Router();

// Removing /api prefix since it's added globally
ratingRoutes.post(
  "/ratings", 
  authMiddleware, 
  isUserMiddleware, 
  validate(ratingSchema),
  ratingController.addRating
);

ratingRoutes.get(
  "/ratings/:companyId",
  validate(companyIdParamSchema, 'params'),
  ratingController.getCompanyRatings
);

ratingRoutes.get(
  "/users/:userId/ratings",
  authMiddleware,
  validate(userIdParamSchema, 'params'),
  ratingController.getUserRatings
);

ratingRoutes.delete(
  "/ratings/:companyId", 
  authMiddleware, 
  isUserMiddleware,
  validate(companyIdParamSchema, 'params'),
  ratingController.deleteRating
);

module.exports = ratingRoutes;
