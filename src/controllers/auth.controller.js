import JwtService from '../services/jwt.service';
import CompanyRepository from '../data-access/companies';
import EmployeeRepository from '../data-access/employees';
const Yup = require('yup');
const bcrypt = require('bcryptjs');
const { BadRequestError, UnauthorizedError, ValidationError, NotFoundError, BadTokenError } = require('../utils/errors/types/Api.error');
const loggingService = require('../services/logging.service');

const UserRepository = require('../data-access/users');

const logger = loggingService.getLogger();

const authController = {
  register: async (req, res, next) => {
    try {
      const { accountType } = req.body;
      logger.info(`Registration attempt for account type: ${accountType}`);
      
      if (accountType === 'company') {
        const companySchema = Yup.object().shape({
          company_name: Yup.string().required(),
          email: Yup.string().email().required(),
          password: Yup.string().required().min(6),
          phone_number: Yup.string().required(),
          location: Yup.string().required(),
          logo_url: Yup.string().required()
        });
        const validationErrors = await companySchema.validate(req.body, { abortEarly: false }).catch(err => err.errors);
        
        if (validationErrors.length) {
          logger.warn('Company registration validation failed', { errors: validationErrors });
          
          throw new ValidationError(validationErrors);
        }
        
        const { email, company_name, password } = req.body;
        
        // Check if company exists by email or name
        const companyExists = await CompanyRepository.findCompanyDetailsByEmailOrName(email, company_name);
        
        if (companyExists) {
          logger.warn('Company registration failed - company already exists', { email, company_name });
          throw new BadRequestError('Company with this email or name already exists');
        }
        
        const password_hash = await bcrypt.hash(password, 8);
        
        const company = await CompanyRepository.create({
          ...req.body,
          password_hash,
          approved: false
        });
        
        logger.info('Company registered successfully', { company_id: company.company_id, company_name });
        
        // Remove sensitive data
        company.password_hash = undefined;
        
        const jwtResponse = JwtService.jwtSign(company.company_id);
        const { token } = jwtResponse;
        
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        };
        
        if (process.env.SERVER_JWT_USE_EXPIRY === "true") {
          cookieOptions.maxAge = Number(process.env.SERVER_JWT_TIMEOUT);
        }
        
        res.cookie('token', token, cookieOptions);

        if (jwtResponse.refreshToken) {
          res.cookie('refresh_token', jwtResponse.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: Number(process.env.SERVER_JWT_REFRESH_MAX_AGE),
            sameSite: 'strict',
            path: '/'
          });
          
          return res.success('Company registered successfully', { company, token, refreshToken: jwtResponse.refreshToken });
        }
        
        return res.success('Company registered successfully', { company, token });
        
      } else {
        // Default to user registration
        const userSchema = Yup.object().shape({
          name: Yup.string().required(),
          username: Yup.string().required(),
          email: Yup.string().email().required(),
          password: Yup.string().required().min(6),
          phone_number: Yup.string().required(),
          address: Yup.string().required(),
          profile_picture_url: Yup.string().nullable()
        });
        
        const validationErrors = await userSchema.validate(req.body, { abortEarly: false }).catch(err => err.errors);
        
        if (validationErrors.length) {
          logger.warn('User registration validation failed', { errors: validationErrors });
          
          throw new ValidationError(validationErrors);
        }
        
        const { email, username, password } = req.body;
        
        const userExists = await UserRepository.findOneByEmailOrUsername({ email, username });
        
        if (userExists) {
          logger.warn('User registration failed - user already exists', { email, username });
          throw new BadRequestError('User with this email or username already exists');
        }
        
        const password_hash = await bcrypt.hash(password, 8);
        const user = await UserRepository.create({
          ...req.body,
          acc_type: 'user',
          password_hash
        });
        
        logger.info('User registered successfully', { user_id: user.user_id, username });
        
        // Remove sensitive data
        user.password_hash = undefined;
        
        const jwtResponse = JwtService.jwtSign(user.user_id);
        const { token } = jwtResponse;
        
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        };
        
        if (process.env.SERVER_JWT_USE_EXPIRY === "true") {
          cookieOptions.maxAge = Number(process.env.SERVER_JWT_TIMEOUT);
        }
        
        res.cookie('token', token, cookieOptions);

        if (jwtResponse.refreshToken) {
          res.cookie('refresh_token', jwtResponse.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: Number(process.env.SERVER_JWT_REFRESH_MAX_AGE),
            sameSite: 'strict',
            path: '/'
          });
          
          return res.success('User registered successfully', { user, token, refreshToken: jwtResponse.refreshToken });
        }
        
        return res.success('User registered successfully', { user, token });
      }
    } catch (error) {
      logger.error('Registration error', { error: error.message, stack: error.stack });
      next(error);
    }
  },
  
  login: async (req, res, next) => {
    try {
      const { email, accountType } = req.body;
      logger.info(`Login attempt for: ${email} as ${accountType}`);
      
      const { password } = req.body;
      
      if (accountType === 'company') {
        const company = await CompanyRepository.findByEmail(email);
        
        if (!company) {
          logger.warn(`Login failed - company not found: ${email}`);
          throw new BadRequestError('Company not found');
        }
        
        const passwordMatch = await bcrypt.compare(password, company.password_hash);
        
        if (!passwordMatch) {
          logger.warn(`Login failed - invalid password for company: ${email}`);
          throw new UnauthorizedError();
        }
        
        if (!company.approved) {
          logger.warn(`Login failed - company account pending approval: ${email}`);
          throw new UnauthorizedError('Company account pending approval');
        }
        
        // Remove sensitive data
        company.password_hash = undefined;
        
        const jwtResponse = JwtService.jwtSign(company.company_id);
        const { token } = jwtResponse;
        
        logger.info(`Login successful for company: ${email}`, { company_id: company.company_id });
        
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        };
        
        if (process.env.SERVER_JWT_USE_EXPIRY === "true") {
          cookieOptions.maxAge = Number(process.env.SERVER_JWT_TIMEOUT);
        }
        
        res.cookie('token', token, cookieOptions);

        if (jwtResponse.refreshToken) {
          res.cookie('refresh_token', jwtResponse.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: Number(process.env.SERVER_JWT_REFRESH_MAX_AGE),
            sameSite: 'strict',
            path: '/'
          });
          
          return res.success('Login successful', { company, token, refreshToken: jwtResponse.refreshToken });
        }
        
        return res.success('Login successful', { company, token });
        
      } else {
        // Default to user login
        const user = await UserRepository.findOneByEmail(email);
        
        if (!user) {
          logger.warn(`Login failed - user not found: ${email}`);
          throw new BadRequestError('User not found');
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!passwordMatch) {
          logger.warn(`Login failed - invalid password for user: ${email}`);
          throw new UnauthorizedError();
        }
        
        // Remove sensitive data
        user.password_hash = undefined;
        
        // Check if this user is an employee
        let employeeData = null;
        if (user.acc_type === 'employee') {
          employeeData = await EmployeeRepository.findByUserId(user.user_id);
          logger.info(`Employee data retrieved for user: ${email}`, { user_id: user.user_id });
        }
        
        const jwtResponse = JwtService.jwtSign(user.user_id);
        const { token } = jwtResponse;
        
        logger.info(`Login successful for user: ${email}`, { user_id: user.user_id });
        
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        };
        
        if (process.env.SERVER_JWT_USE_EXPIRY === "true") {
          cookieOptions.maxAge = Number(process.env.SERVER_JWT_TIMEOUT);
        }
        
        res.cookie('token', token, cookieOptions);

        if (jwtResponse.refreshToken) {
          res.cookie('refresh_token', jwtResponse.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: Number(process.env.SERVER_JWT_REFRESH_MAX_AGE),
            sameSite: 'strict',
            path: '/'
          });
          
          return res.success('Login successful', { user, employeeData, token, refreshToken: jwtResponse.refreshToken });
        }
        
        return res.success('Login successful', { user, employeeData, token });
      }
    } catch (error) {
      logger.error('Login error', { error: error.message, stack: error.stack });
      next(error);
    }
  },
  
  me: async (req, res, next) => {
    try {
      logger.info('Profile retrieval attempt', { userId: req.userId });
      
      // Try to find user first with excluded password_hash
      const user = await UserRepository.findByIdExcludeProps(req.userId, ['password_hash']);
      
      if (user) {
        // Check if the user is an employee
        logger.info(`${user.acc_type} profile retrieved`, { user_id: user.user_id });
        if (user.acc_type === 'employee') {
          const employeeData = await EmployeeRepository.findByUserId(user.user_id);
          return res.success('Profile retrieved successfully', { user, employeeData });
        }

        return res.success('Profile retrieved successfully', { user });
      }
      
      // If not a user, try to find a company with full details
      const company = await CompanyRepository.findCompanyWithAllDetails(req.userId);
      
      if (company) {
        logger.info('Company profile retrieved', { company_id: company.company_id });
        return res.success('Profile retrieved successfully', { company });
      }
      
      logger.warn('Profile not found', { userId: req.userId });
      throw new NotFoundError('Profile not found');
    } catch (error) {
      logger.error('Profile retrieval error', { error: error.message, stack: error.stack });
      next(error);
    }
  },

  refreshToken: (req, res, next) => {
    try {
      console.log(process.env.SERVER_JWT_REFRESH_ENABLED);
      
      if (process.env.SERVER_JWT_REFRESH_ENABLED !== "true") {
        throw new BadRequestError('Refresh token functionality is not enabled');
      }
      
      let refreshToken = req.cookies.refresh_token;
      
      if (!refreshToken && req.body.refresh_token) {
        refreshToken = req.body.refresh_token;
      }

      if (!refreshToken)
        throw new BadRequestError('Refresh token is required!');

      const token = JwtService.jwtRefreshToken(refreshToken);

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      };
      
      if (process.env.SERVER_JWT_USE_EXPIRY === "true") {
        cookieOptions.maxAge = Number(process.env.SERVER_JWT_TIMEOUT);
      }
      
      res.cookie('token', token, cookieOptions);

      res.success('Refresh token exchanged successfully', { token });
    } catch (error) {
      logger.error('Refresh token error', { error: error.message, stack: error.stack });
      next(new BadTokenError('Bad refresh token'));
    }
  },
  
  logout: (req, res, next) => {
    try {
      const token = JwtService.jwtGetToken(req);

      JwtService.jwtBlacklistToken(token);

      res.clearCookie('token');
      if (process.env.SERVER_JWT_REFRESH_ENABLED === "true") {
        res.clearCookie('refresh_token');
      }

      res.success('Logged out successfully!');
    } catch (error) {
      logger.error('Logout error', { error: error.message });
      next(error);
    }
  }
};

module.exports = authController;
