const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require("../middlewares/validation.middleware");
const Yup = require("yup");

const loginSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  accountType: Yup.string().oneOf(['user', 'company']).required()
});

const authRoutes = Router();

// Register routes - removing /api prefix since it's added globally in express.service.js
authRoutes.post(
  '/auth/register', 
  authController.register
);

authRoutes.post(
  '/auth/login', 
  validate(loginSchema),
  authController.login
);

authRoutes.post(
  '/auth/refresh',
  authController.refreshToken
);

authRoutes.post(
  '/auth/logout',
  authController.logout
)

authRoutes.get('/auth/me', authMiddleware, authController.me);

module.exports = authRoutes;
