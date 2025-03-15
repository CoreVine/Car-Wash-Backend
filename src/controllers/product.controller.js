const Yup = require("yup");
const { Op } = require("sequelize");
// Import repositories
import ProductRepository from "../data-access/products";
import ProductImageRepository from "../data-access/product-images";
import CategoryRepository from "../data-access/categories"; 
import SubCategoryRepository from "../data-access/sub-categories";
import SubCatProductRepository from "../data-access/sub-cat-products";
import CompanyRepository from "../data-access/companies";
const awsService = require("../services/aws.service");
const { createPagination } = require("../utils/responseHandler");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError
} = require("../utils/errors/types/Api.error");

const productController = {
  addProduct: async (req, res, next) => {
    try {
      const { product_name, description, price, stock, sub_category_ids } = req.body;
      
      // Validate subcategories exist using the repository's model for counting
      const subCategoriesCount = await SubCategoryRepository.model.count({
        where: {
          sub_category_id: { [Op.in]: sub_category_ids }
        }
      });
      
      if (subCategoriesCount !== sub_category_ids.length) {
        throw new BadRequestError('One or more subcategories do not exist');
      }

      // Create the product
      const product = await ProductRepository.create({
        product_name,
        description,
        price,
        stock,
        company_id: req.company.company_id
      });
      
      // Use the new repository method for creating associations
      await SubCatProductRepository.createSubCategoryProductAssociations(product.product_id, sub_category_ids);
      
      // Get product with subcategories
      const createdProduct = await ProductRepository.findWithSubcategories(product.product_id);

      return res.success('Product added successfully', createdProduct);
    } catch (error) {
      next(error);
    }
  },
  
  getProducts: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      
      // Use the new repository method with filters from query params
      const { count, rows } = await ProductRepository.findProductsWithFilters({
        page,
        limit,
        company_id: req.query.company_id,
        category_id: req.query.category_id,
        sub_category_id: req.query.sub_category_id,
        min_price: req.query.min_price,
        max_price: req.query.max_price,
        search: req.query.search
      });

      const pagination = createPagination(page, limit, count);

      return res.success('Products retrieved successfully', rows, pagination);
    } catch (error) {
      next(error);
    }
  },
  
  getProduct: async (req, res, next) => {
    try {
      const { productId } = req.params;
      
      // Use the new repository method
      const product = await ProductRepository.findDetailedProduct(productId);

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      return res.success('Product retrieved successfully', product);
    } catch (error) {
      next(error);
    }
  },
  
  updateProduct: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const product = await ProductRepository.findById(productId);
      
      if (!product) {
        throw new NotFoundError('Product not found');
      }
      
      // Check if user has permission to update this product
      if (!req.adminEmployee) {
        const company = await CompanyRepository.findById(req.userId);
        
        if (company) {
          if (company.company_id !== product.company_id) {
            throw new ForbiddenError('You do not have permission to update this product');
          }
        } else {
          throw new ForbiddenError('You do not have permission to update this product');
        }
      }
      
      // Update product basic info
      await ProductRepository.update(productId, req.body);
      
      // Update subcategories if provided
      if (req.body.sub_category_ids && req.body.sub_category_ids.length > 0) {
        // Validate subcategories exist
        const subCategoriesCount = await SubCategoryRepository.count({
          sub_category_id: { [Op.in]: req.body.sub_category_ids }
        });
        
        if (subCategoriesCount !== req.body.sub_category_ids.length) {
          throw new BadRequestError('One or more subcategories do not exist');
        }
        
        // Use the new repository method for updating associations
        await SubCatProductRepository.updateSubCategoryAssociations(productId, req.body.sub_category_ids);
      }
      
      // Get updated product with subcategories
      const updatedProduct = await ProductRepository.findDetailedProduct(productId);

      return res.success('Product updated successfully', updatedProduct);
    } catch (error) {
      next(error);
    }
  },
  
  deleteProduct: async (req, res, next) => {
    try {
      const { productId } = req.params;
      
      const product = await ProductRepository.findById(productId);
      
      if (!product) {
        throw new NotFoundError('Product not found');
      }
      
      // Check if user has permission to delete this product
      if (!req.adminEmployee) {
        const company = await CompanyRepository.findById(req.userId);
        
        if (company) {
          if (company.company_id !== product.company_id) {
            throw new ForbiddenError('You do not have permission to delete this product');
          }
        } else {
          throw new ForbiddenError('You do not have permission to delete this product');
        }
      }
      
      // Delete all product images from S3
      const images = await ProductImageRepository.findByProductId(productId);
      
      for (const image of images) {
        const imageUrl = image.image_url;
        const fileExt = imageUrl.split('.').pop();
        const fileUUID = imageUrl.split('.')[0];
        
        try {
          await awsService.deleteFile(fileUUID, fileExt, 'product-images/');
        } catch (err) {
          console.log(`Error deleting image from S3: ${err.message}`);
        }
      }
      
      // Use repository method to delete associations first to ensure clean deletion
      await SubCatProductRepository.deleteByProductId(productId);
      
      // Delete the product
      await ProductRepository.delete(productId);

      return res.success('Product deleted successfully');
    } catch (error) {
      next(error);
    }
  },
  
  addProductImage: async (req, res, next) => {
    try {
      const { productId } = req.params;
      
      if (!req.file) {
        throw new BadRequestError('No image uploaded');
      }
      
      const product = await Product.findByPk(productId);
      
      if (!product) {
        throw new NotFoundError('Product not found');
      }
      
      // Check if user has permission to update this product
      if (!req.adminEmployee) {
        const company = await Company.findByPk(req.userId);
        
        if (company) {
          if (company.company_id !== product.company_id) {
            throw new ForbiddenError('You do not have permission to update this product');
          }
        } else {
          throw new ForbiddenError('You do not have permission to update this product');
        }
      }
      
      // Get file extension
      const fileExt = req.file.originalname.split('.').pop();
      
      // Upload file to AWS S3
      const uuid = await awsService.uploadFile(req.file, fileExt, 'product-images/');
      
      // Create image record in database
      const image = await ProductImage.create({
        product_id: productId,
        image_url: `${uuid}.${fileExt}`
      });

      return res.success('Image uploaded successfully', image);
    } catch (error) {
      next(error);
    }
  },
  
  deleteProductImage: async (req, res, next) => {
    try {
      const { productId, imageId } = req.params;
      
      const image = await ProductImage.findOne({
        where: { 
          image_id: imageId,
          product_id: productId
        },
        include: [{
          model: Product,
          as: 'product'
        }]
      });
      
      if (!image) {
        throw new NotFoundError('Image not found');
      }
      
      // Check if user has permission to delete this image
      if (!req.adminEmployee) {
        const company = await Company.findByPk(req.userId);
        
        if (company) {
          if (company.company_id !== image.product.company_id) {
            throw new ForbiddenError('You do not have permission to delete this image');
          }
        } else {
          throw new ForbiddenError('You do not have permission to delete this image');
        }
      }
      
      // Delete from S3
      const imageUrl = image.image_url;
      const fileExt = imageUrl.split('.').pop();
      const fileUUID = imageUrl.split('.')[0];
      
      try {
        await awsService.deleteFile(fileUUID, fileExt, 'product-images/');
      } catch (err) {
        console.log(`Error deleting image from S3: ${err.message}`);
      }
      
      // Delete from database
      await image.destroy();

      return res.success('Image deleted successfully');
    } catch (error) {
      next(error);
    }
  },
  
  getCategories: async (req, res, next) => {
    try {
      // Use the new repository method
      const categories = await CategoryRepository.findAllWithSubCategories();

      return res.success('Categories retrieved successfully', categories);
    } catch (error) {
      next(error);
    }
  },
  
  getSubCategories: async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      
      const category = await CategoryRepository.findById(categoryId);
      
      if (!category) {
        throw new NotFoundError('Category not found');
      }
      
      // Use the new repository method with pagination
      const { count, rows } = await SubCategoryRepository.findByCategoryIdPaginated(categoryId, page, limit);
      
      const pagination = createPagination(page, limit, count);

      return res.success('Subcategories retrieved successfully', rows, pagination);
    } catch (error) {
      next(error);
    }
  },
  
  addCategory: async (req, res, next) => {
    try {
      const { category_name } = req.body;
      
      // Check if category already exists
      const categoryExists = await CategoryRepository.findOne({
        where: { category_name }
      });
      
      if (categoryExists) {
        throw new BadRequestError('Category with this name already exists');
      }
      
      const category = await CategoryRepository.create({
        category_name
      });

      return res.success('Category added successfully', category);
    } catch (error) {
      next(error);
    }
  },
  
  addSubCategory: async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const { name } = req.body;
      
      // Check if category exists
      const category = await CategoryRepository.findByPk(categoryId);
      
      if (!category) {
        throw new NotFoundError('Category not found');
      }
      
      // Check if subcategory already exists
      const subCategoryExists = await SubCategoryRepository.findOne({
        where: { 
          name,
          category_id: categoryId
        }
      });
      
      if (subCategoryExists) {
        throw new BadRequestError('Subcategory with this name already exists in this category');
      }
      
      const subCategory = await SubCategoryRepository.create({
        name,
        category_id: categoryId
      });

      return res.success('Subcategory added successfully', subCategory);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;
