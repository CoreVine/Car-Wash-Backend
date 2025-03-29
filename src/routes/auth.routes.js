const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const passwordResetController = require('../controllers/passwordReset.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require("../middlewares/validation.middleware");
const Yup = require("yup");

const loginSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  accountType: Yup.string().oneOf(['user', 'company']).required()
});

const passwordResetRequestSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  accountType: Yup.string().oneOf(['user', 'company', 'employee']).required()
});

const verifyCodeSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  code: Yup.string().length(6).required(),
  accountType: Yup.string().oneOf(['user', 'company', 'employee']).required()
});

const resetPasswordSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  resetToken: Yup.string().required(),
  accountType: Yup.string().oneOf(['user', 'company', 'employee']).required()
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

// Password reset routes
authRoutes.post(
  '/auth/password/request',
  validate(passwordResetRequestSchema),
  passwordResetController.requestVerificationCode
);

authRoutes.post(
  '/auth/password/resend',
  validate(passwordResetRequestSchema),
  passwordResetController.resendVerificationCode
);

authRoutes.post(
  '/auth/password/verify',
  validate(verifyCodeSchema),
  passwordResetController.verifyCode
);

authRoutes.post(
  '/auth/password/reset',
  validate(resetPasswordSchema),
  passwordResetController.resetPassword
);

module.exports = authRoutes;
