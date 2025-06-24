const UserRepository = require("../data-access/users");
const { createPagination } = require("../utils/responseHandler");
const fs = require("fs");
const { deleteUploadedFile } = require("../config/multer.config");
const { getRelativePath } = require("../utils/fileUtils");
const {
  BadRequestError,
  UnauthorizedError,
  ValidationError,
  ForbiddenError,
  NotFoundError
} = require("../utils/errors/types/Api.error.js");

let userController = {
  add: async (req, res, next) => {
    try {
      const { email } = req.body;

      // Check if user already exists
      const userExists = await UserRepository.findOneByEmail(email);

      if (userExists) {
        throw new BadRequestError('Email already in use');
      }

      const user = await UserRepository.create(req.body);
      
      // Remove sensitive data from response
      user.password_hash = undefined;

      return res.success('User created successfully', user);
    } catch (error) {
      next(error);
    }
  },
  
  get: async (req, res, next) => {
    try {
      // Only admin users should be able to get all users
      if (!req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to view all users');
      }

      const users = await UserRepository.findAll({
        attributes: { exclude: ['password_hash'] }
      });

      return res.success('Users retrieved successfully', users);
    } catch (error) {
      next(error);
    }
  },

  getPaginated: async (req, res, next) => {
    try {
      // Only admin users should be able to get all users
      if (!req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to view all users');
      }
      
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const offset = (page - 1) * limit;

      const options = {
        limit,
        offset,
        attributes: { exclude: ['password_hash'] }
      };

      const { count, rows } = await UserRepository.model.findAndCountAll(options);

      // Create pagination object
      const pagination = createPagination(page, limit, count);

      return res.success('Users retrieved successfully', rows, pagination);
    } catch (error) {
      next(error);
    }
  },

  find: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Only admin or the user themselves can view user details
      if (req.userId !== parseInt(id) && !req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to view this user');
      }
      
      const user = await UserRepository.findByIdExcludeProps(id, ['password_hash']);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return res.success('User found', user);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Only admin or the user themselves can update user details
      if (req.userId !== parseInt(id) && !req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to update this user');
      }
      
      const user = await UserRepository.findById(id);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const { email, oldPassword } = req.body;

      // Check if email is being changed and already exists
      if (email && email !== user.email) {
        const userExists = await UserRepository.findOneByEmail(email);

        if (userExists) {
          throw new BadRequestError('Email already in use');
        }
      }

      // Verify old password if provided
      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        throw new UnauthorizedError('Password does not match');
      }

      await UserRepository.update(id, req.body);
      
      // Get updated user
      const updatedUser = await UserRepository.findByIdExcludeProps(id, ['password_hash']);

      return res.success('User updated successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Only admin should be able to delete other users
      if (!req.adminEmployee && req.userId !== parseInt(id)) {
        throw new ForbiddenError('You do not have permission to delete users');
      }
      
      const user = await UserRepository.findById(id);
      
      if (!user) {
        throw new NotFoundError('User not found');
      }
      
      // Delete profile picture if exists
      if (user.profile_picture_url) {
        await deleteUploadedFile(user.profile_picture_url);
      }

      // Use our special repository method that handles the deletion order
      await UserRepository.deleteUserWithRelations(id);

      return res.success('User deleted successfully', { id });
    } catch (error) {
      next(error);
    }
  },

  // New API methods
  
  getAllUsers: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      // Use the new repository method instead of passing Sequelize options
      const { count, rows } = await UserRepository.findAllPaginatedUsers(page, limit);

      const pagination = createPagination(page, limit, count);

      return res.success('Users retrieved successfully', rows, pagination);
    } catch (error) {
      next(error);
    }
  },

  getUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      
      // Only admin or the user themselves can view user details
      if (req.userId !== parseInt(userId) && !req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to view this user');
      }
      
      const user = await UserRepository.findByIdExcludeProps(userId, ['password_hash']);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return res.success('User retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      
      // Only admin or the user themselves can update user details
      if (req.userId !== parseInt(userId) && !req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to update this user');
      }

      const user = await UserRepository.findById(userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const { email, oldPassword } = req.body;

      // Check if email is being changed and already exists
      if (email && email !== user.email) {
        const userExists = await UserRepository.findOneByEmail(email);

        if (userExists) {
          throw new BadRequestError('Email already in use');
        }
      }

      // Verify old password if provided
      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        throw new UnauthorizedError('Password does not match');
      }

      const updatedUser = await user.update(req.body);
      
      // Remove sensitive data
      updatedUser.password_hash = undefined;

      return res.success('User updated successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  },

  // New method to upload a profile picture
  uploadProfilePicture: async (req, res, next) => {
    try {
      const { userId } = req.params;
      
      // Only admin or the user themselves can upload profile picture
      if (req.userId !== parseInt(userId) && !req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to upload a profile picture for this user');
      }
      
      // Check if file exists in the request
      if (!req.file) {
        throw new ValidationError(['Profile picture is required']);
      }

      const user = await UserRepository.findById(userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }
      
      // Delete old profile picture if exists using our modular function
      if (user.profile_picture_url) {
        await deleteUploadedFile(user.profile_picture_url);
      }
      
      // Create the relative path for the uploaded file
      const profilePictureUrl = getRelativePath(req.file.path, 'profile-pictures');
      
      // Update user with new profile picture URL
      const updatedUser = await user.update({ profile_picture_url: profilePictureUrl });
      
      // Remove sensitive data
      updatedUser.password_hash = undefined;

      return res.success('Profile picture uploaded successfully', updatedUser);
    } catch (error) {
      // If error occurs, clean up the uploaded file
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error cleaning up file after error:', err);
        });
      }
      next(error);
    }
  },

  // Updated method for updating the profile picture
  updateProfilePicture: async (req, res, next) => {
    try {
      const { userId } = req.params;
      
      // Only admin or the user themselves can update profile picture
      if (req.userId !== parseInt(userId) && !req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to update this profile picture');
      }
      
      // Check if file exists in the request
      if (!req.file) {
        throw new ValidationError(['Profile picture is required']);
      }

      const user = await UserRepository.findById(userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }
      
      // Delete old profile picture if exists using our modular function
      if (user.profile_picture_url) {
        await deleteUploadedFile(user.profile_picture_url);
      }
      
      // Create the relative path for the uploaded file
      const profilePictureUrl = getRelativePath(req.file.path, 'profile-pictures');
      
      // Update user with new profile picture URL
      const updatedUser = await user.update({ profile_picture_url: profilePictureUrl });
      
      // Remove sensitive data
      updatedUser.password_hash = undefined;

      return res.success('Profile picture updated successfully', updatedUser);
    } catch (error) {
      // If error occurs, clean up the uploaded file
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error cleaning up file after error:', err);
        });
      }
      next(error);
    }
  },

  // Updated method to delete profile picture with file handling
  deleteProfilePicture: async (req, res, next) => {
    try {
      const { userId } = req.params;
      
      // Only admin or the user themselves can delete profile picture
      if (req.userId !== parseInt(userId) && !req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to delete this profile picture');
      }
      
      const user = await UserRepository.findById(userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }
      
      // Delete file from storage using our modular function
      if (user.profile_picture_url) {
        await deleteUploadedFile(user.profile_picture_url);
      }
      
      // Update user to remove profile picture URL
      const updatedUser = await user.update({ profile_picture_url: null });
      
      // Remove sensitive data
      updatedUser.password_hash = undefined;

      return res.success('Profile picture deleted successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
