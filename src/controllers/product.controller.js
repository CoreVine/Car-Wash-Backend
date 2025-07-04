const { Op } = require("sequelize");
// Import repositories
const ProductRepository = require("../data-access/products");
const ProductImageRepository = require("../data-access/product-images");
const CategoryRepository = require("../data-access/categories");
const SubCategoryRepository = require("../data-access/sub-categories");
const SubCatProductRepository = require("../data-access/sub-cat-products");
const CompanyRepository = require("../data-access/companies");

// Remove AWS service import
const { createPagination } = require("../utils/responseHandler");
const { getRelativePath } = require("../utils/fileUtils");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors/types/Api.error");

const multerConfig = require("../config/multer.config");

const productController = {
  addProduct: async (req, res, next) => {
    try {
      const { product_name, description, price, stock, sub_category_ids } =
        req.body;

      // Validate subcategories exist using the repository's model for counting
      const subCategoriesCount = await SubCategoryRepository.model.count({
        where: {
          sub_category_id: { [Op.in]: sub_category_ids },
        },
      });

      if (subCategoriesCount !== sub_category_ids.length) {
        throw new BadRequestError("One or more subcategories do not exist");
      }

      // Create the product
      const product = await ProductRepository.create({
        product_name,
        description,
        price,
        stock,
      });

      // Use the new repository method for creating associations
      await SubCatProductRepository.createSubCategoryProductAssociations(
        product.product_id,
        sub_category_ids
      );

      // Handle image uploads if files are present
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          // Create a relative path for public access
          const relativePath = getRelativePath(file.path, "product-images");

          // Create image record in database with relative path
          await ProductImageRepository.create({
            product_id: product.product_id,
            image_url: relativePath,
          });
        }
      }

      // Get product with subcategories and images
      const createdProduct = await ProductRepository.findWithSubcategories(
        product.product_id
      );

      return res.success("Product added successfully", createdProduct);
    } catch (error) {
      next(error);
    }
  },

  getProducts: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const { category_id, sub_category_id, min_price, max_price, search } =
        req.query;

      // ✅ تحقق من صلاحية الفئة أو الفئة الفرعية إذا كانت موجودة
      if (category_id) {
        const category = await CategoryRepository.findById(category_id);
        if (!category) {
          throw new NotFoundError("Category not found");
        }
      }

      if (sub_category_id) {
        const subCategory = await SubCategoryRepository.findById(
          sub_category_id
        );
        if (!subCategory) {
          throw new NotFoundError("Subcategory not found");
        }
      }

      // ✅ استخدام الفلترة العامة التي تدعم جميع المعايير
      const { count, rows } = await ProductRepository.findProductsWithFilters({
        page,
        limit,
        category_id,
        sub_category_id,
        min_price,
        max_price,
        search,
        imageLimit: 1, // Limit to one image per product
      });

      // ✅ إنشاء معلومات التصفح (pagination)
      const pagination = createPagination(page, limit, count);

      // ✅ الإرجاع الناجح
      return res.success("Products retrieved successfully", rows, pagination);
    } catch (error) {
      next(error);
    }
  },

  getProduct: async (req, res, next) => {
    try {
      const { productId } = req.params;

      // Use the repository method with full image inclusion
      const product = await ProductRepository.findDetailedProduct(productId, {
        includeAllImages: true, // Ensure all images are included for a single product
      });

      if (!product) {
        throw new NotFoundError("Product not found");
      }

      return res.success("Product retrieved successfully", product);
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const product = await ProductRepository.findById(productId);

      if (!product) {
        throw new NotFoundError("Product not found");
      }

      // Check if user has permission to update this product
      if (!req.adminEmployee) {
        const company = await CompanyRepository.findById(req.userId);

        if (company) {
          if (company.company_id !== product.company_id) {
            throw new ForbiddenError(
              "You do not have permission to update this product"
            );
          }
        } else {
          throw new ForbiddenError(
            "You do not have permission to update this product"
          );
        }
      }

      // Update product basic info
      await ProductRepository.update(productId, req.body);

      // Update subcategories if provided
      if (req.body.sub_category_ids && req.body.sub_category_ids.length > 0) {
        // Validate subcategories exist
        const subCategoriesCount = await SubCategoryRepository.count({
          sub_category_id: { [Op.in]: req.body.sub_category_ids },
        });

        if (subCategoriesCount !== req.body.sub_category_ids.length) {
          throw new BadRequestError("One or more subcategories do not exist");
        }

        // Use the new repository method for updating associations
        await SubCatProductRepository.updateSubCategoryAssociations(
          productId,
          req.body.sub_category_ids
        );
      }

      // Get updated product with subcategories
      const updatedProduct = await ProductRepository.findDetailedProduct(
        productId
      );

      return res.success("Product updated successfully", updatedProduct);
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const { productId } = req.params;

      const product = await ProductRepository.findById(productId);

      if (!product) {
        throw new NotFoundError("Product not found");
      }

      // Delete all product images from S3
      const images = await ProductImageRepository.findByProductId(productId);

      for (const image of images) {
        const imageUrl = image.image_url;
        const fileExt = imageUrl.split(".").pop();
        const fileUUID = imageUrl.split(".")[0];

        try {
          await awsService.deleteFile(fileUUID, fileExt, "product-images/");
        } catch (err) {
          console.log(`Error deleting image from S3: ${err.message}`);
        }
      }

      // Use repository method to delete associations first to ensure clean deletion
      await SubCatProductRepository.deleteByProductId(productId);

      // Delete the product
      await ProductRepository.delete(productId);

      return res.success("Product deleted successfully");
    } catch (error) {
      next(error);
    }
  },

  addProductImage: async (req, res, next) => {
    try {
      const { productId } = req.params;

      if (!req.file) {
        throw new BadRequestError("No image uploaded");
      }

      const product = await ProductRepository.findById(productId);
      if (!product) {
        throw new NotFoundError("Product not found");
      }

      // Create a relative path for public access
      const relativePath =
        req.file.url || getRelativePath(req.file.path, "subcategory-icons");

      // Create image record in database with relative path
      const image = await ProductImageRepository.create({
        product_id: productId,
        image_url: relativePath,
      });

      return res.success("Image uploaded successfully", image);
    } catch (error) {
      next(error);
    }
  },

  deleteProductImage: async (req, res, next) => {
    try {
      const { productId, imageId } = req.params;

      const image = await ProductImageRepository.findOne({
        where: {
          image_id: imageId,
          product_id: productId,
        },
      });
      if (!image) {
        throw new NotFoundError("Image not found");
      }

      // Check if user has permission to delete this image
      if (!req.adminEmployee) {
        const company = await CompanyRepository.findById(req.userId);

        if (company) {
          if (company.company_id !== image.product.company_id) {
            throw new ForbiddenError(
              "You do not have permission to delete this image"
            );
          }
        } else {
          throw new ForbiddenError(
            "You do not have permission to delete this image"
          );
        }
      }

      // Delete file from local storage
      try {
        await multerConfig.deleteUploadedFile(image.image_url);
      } catch (err) {
        console.log(`Error deleting image from storage: ${err.message}`);
      }

      // Delete from database
      await image.destroy();

      return res.success("Image deleted successfully");
    } catch (error) {
      next(error);
    }
  },

  getCategories: async (req, res, next) => {
    try {
      // Use the new repository method
      const categories = await CategoryRepository.findAllWithSubCategories();

      return res.success("Categories retrieved successfully", categories);
    } catch (error) {
      next(error);
    }
  },

  getCategory: async (req, res, next) => {
    try {
      // Use the new repository method
      const { id } = req.params;
      const category = await CategoryRepository.findById(id);

      return res.success("category retrieved successfully", category);
    } catch (error) {
      next(error);
    }
  },

  getSubCategories: async (req, res, next) => {
    try {
      const { categoryId } = req.params;

      const category = await CategoryRepository.findById(categoryId);

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      // Use the new repository method with pagination
      const rows = await SubCategoryRepository.findByCategoryId(categoryId);

      return res.success("Subcategories retrieved successfully", rows);
    } catch (error) {
      next(error);
    }
  },

  addCategory: async (req, res, next) => {
    try {
      const { category_name } = req.body;

      // Check if category already exists
      const categoryExists = await CategoryRepository.findOne({
        where: { category_name },
      });

      if (categoryExists) {
        throw new BadRequestError("Category with this name already exists");
      }

      // Make icon mandatory
      if (!req.file) {
        throw new BadRequestError("Category icon is required");
      }

      // Get icon URL from uploaded file - store as relative path
      const icon =
        req.file.url || getRelativePath(req.file.path, "subcategory-icons");

      const category = await CategoryRepository.create({
        category_name,
        icon,
      });

      return res.success("Category added successfully", category);
    } catch (error) {
      next(error);
    }
  },

  updateCategory: async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const { category_name } = req.body;

      // Check if category exists
      const category = await CategoryRepository.findById(categoryId);

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      // Check if category name already exists for another category
      if (category_name) {
        const categoryWithName = await CategoryRepository.findOne({
          where: {
            category_name,
            category_id: { [Op.ne]: categoryId },
          },
        });

        if (categoryWithName) {
          throw new BadRequestError("Category with this name already exists");
        }
      }

      const updateData = { ...req.body };

      // Handle icon upload - icon required for new categories but optional for updates
      if (req.file) {
        // Delete the old icon if it exists
        if (category.icon) {
          await multerConfig.deleteUploadedFile(category.icon);
        }

        // Save the new icon URL as relative path
        updateData.icon =
          req.file.url || getRelativePath(req.file.path, "category-icons");
      }

      // Update the category
      await CategoryRepository.update(categoryId, updateData);

      // Get the updated category
      const updatedCategory = await CategoryRepository.findById(categoryId);

      return res.success("Category updated successfully", updatedCategory);
    } catch (error) {
      next(error);
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      const { categoryId } = req.params;

      // Check if category exists
      const category = await CategoryRepository.findById(categoryId);
      if (!category) {
        throw new NotFoundError("Category not found");
      }

      // Check if category has subcategories
      // const subcategoriesCount = await SubCategoryRepository.count({
      //   where: { category_id: categoryId },
      // });
      const subcategoriesCount = await SubCategoryRepository.count({
        category_id: categoryId,
      });

      if (subcategoriesCount > 0) {
        throw new BadRequestError(
          "Cannot delete category with subcategories. Delete subcategories first or move them to another category."
        );
      }

      // Delete icon if exists
      if (category.icon) {
        await CategoryRepository.delete(categoryId);
      }

      // Delete the category
      await multerConfig.deleteUploadedFile(category.icon);

      return res.success("Category deleted successfully");
    } catch (error) {
      next(error);
    }
  },

  addSubCategory: async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const { name } = req.body;

      // Check if category exists
      const category = await CategoryRepository.findById(categoryId);

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      // Check if subcategory already exists
      const subCategoryExists = await SubCategoryRepository.findOne({
        where: {
          name,
          category_id: categoryId,
        },
      });

      if (subCategoryExists) {
        throw new BadRequestError(
          "Subcategory with this name already exists in this category"
        );
      }

      // Make icon mandatory
      if (!req.file) {
        throw new BadRequestError("Subcategory icon is required");
      }

      // Get icon URL from uploaded file as relative path
      const icon =
        req.file.url ||
        req.file.public_id ||
        getRelativePath(req.file.path, "subcategory-icons");

      // return res.json(icon);
      const subCategory = await SubCategoryRepository.create({
        name,
        category_id: categoryId,
        icon,
      });

      return res.success("Subcategory added successfully", subCategory);
    } catch (error) {
      next(error);
    }
  },

  updateSubCategory: async (req, res, next) => {
    try {
      const { categoryId, subCategoryId } = req.params;
      const { name } = req.body;

      // Check if subcategory exists and belongs to the category
      const subCategory = await SubCategoryRepository.findOne({
        where: {
          sub_category_id: subCategoryId,
          category_id: categoryId,
        },
      });

      if (!subCategory) {
        throw new NotFoundError(
          "Subcategory not found or does not belong to the specified category"
        );
      }

      // Check if subcategory name already exists for another subcategory in the same category
      if (name) {
        const subCategoryWithName = await SubCategoryRepository.findOne({
          where: {
            name,
            category_id: categoryId,
            sub_category_id: { [Op.ne]: subCategoryId },
          },
        });

        if (subCategoryWithName) {
          throw new BadRequestError(
            "Subcategory with this name already exists in this category"
          );
        }
      }

      const updateData = { ...req.body };

      // Handle icon upload - icon required for new subcategories but optional for updates
      if (req.file) {
        // Delete the old icon if it exists
        if (subCategory.icon) {
          await multerConfig.deleteUploadedFile(subCategory.icon);
        }

        // Save the new icon URL as relative path
        updateData.icon =
          req.file.url || getRelativePath(req.file.path, "subcategory-icons");
      }

      // Update the subcategory
      await SubCategoryRepository.update(subCategoryId, updateData);

      // Get the updated subcategory
      const updatedSubCategory = await SubCategoryRepository.findById(
        subCategoryId
      );

      return res.success(
        "Subcategory updated successfully",
        updatedSubCategory
      );
    } catch (error) {
      next(error);
    }
  },

  deleteSubCategory: async (req, res, next) => {
    try {
      const { categoryId, subCategoryId } = req.params;

      // Check if subcategory exists and belongs to the category
      const subCategory = await SubCategoryRepository.findOne({
        where: {
          sub_category_id: subCategoryId,
          category_id: categoryId,
        },
      });

      if (!subCategory) {
        throw new NotFoundError(
          "Subcategory not found or does not belong to the specified category"
        );
      }

      // Check if subcategory is associated with any products
      const productAssociationsCount = await SubCatProductRepository.count({
        sub_category_id: subCategoryId,
      });

      if (productAssociationsCount > 0) {
        throw new BadRequestError(
          "Cannot delete subcategory that has associated products. Remove product associations first."
        );
      }

      // Delete icon if exists
      if (subCategory.icon) {
        await multerConfig.deleteUploadedFile(subCategory.icon);
      }

      // Delete the subcategory
      await SubCategoryRepository.delete(subCategoryId);

      return res.success("Subcategory deleted successfully");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
