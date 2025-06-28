const ProductModel = require("../../models/Product");
const BaseRepository = require("../base.repository");
const { DatabaseError, Op } = require("sequelize");

class ProductRepository extends BaseRepository {
  constructor() {
    super(ProductModel);
  }

  async findWithSubcategories(productId) {
    try {
      return await this.model.findByPk(productId, {
        include: [
          {
            association: "subCategories",
          },
          {
            association: "images",
          },
        ],
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async findProductsWithFilters({
    page = 1,
    limit = 10,
    category_id = null,
    sub_category_id = null,
    min_price = null,
    max_price = null,
    search = null,
    imageLimit = null,
  }) {
    try {
      const offset = (page - 1) * limit;
      const whereClause = {};

      // 🔍 فلترة حسب السعر
      if (min_price !== null || max_price !== null) {
        whereClause.price = {};
        if (min_price !== null) {
          whereClause.price[Op.gte] = parseFloat(min_price);
        }
        if (max_price !== null) {
          whereClause.price[Op.lte] = parseFloat(max_price);
        }
      }

      // 🔍 فلترة بالكلمات المفتاحية
      if (search) {
        whereClause[Op.or] = [
          { product_name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      // 🔗 العلاقات المرتبطة
      const includeOptions = [
        {
          model: this.model.sequelize.model("ProductImage"),
          as: "images",
          attributes: ["image_url"],
          ...(imageLimit && {
            separate: true,
            limit: imageLimit,
          }),
        },
        {
          model: this.model.sequelize.model("SubCategory"),
          as: "subCategories",
          attributes: ["name", "sub_category_id"],
          through: { attributes: [] },
          include: [],
        },
      ];

      // ✅ فلترة حسب الفئة الفرعية
      if (sub_category_id) {
        const subCatInclude = includeOptions.find(
          (inc) => inc.as === "subCategories"
        );
        subCatInclude.where = { sub_category_id };
      }

      // ✅ فلترة حسب الفئة الأساسية
      if (category_id) {
        const subCatInclude = includeOptions.find(
          (inc) => inc.as === "subCategories"
        );
        const categoryInclude = {
          model: this.model.sequelize.model("Category"),
          as: "category",
          attributes: ["category_name", "category_id"],
          where: { category_id },
        };
        subCatInclude.include.push(categoryInclude);
      }

      // ✅ الاستعلام
      const { count, rows } = await this.model.findAndCountAll({
        where: whereClause,
        include: includeOptions,
        limit,
        offset,
        order: [["created_at", "DESC"]],
        distinct: true, // مهم لحساب العدد الصحيح عند استخدام include
      });

      return { count, rows };
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async findDetailedProduct(productId) {
    try {
      return await this.model.findByPk(productId, {
        include: [
          {
            model: this.model.sequelize.model("ProductImage"),
            as: "images",
            attributes: ["image_url"],
          },
          {
            model: this.model.sequelize.model("SubCategory"),
            as: "subCategories",
            attributes: ["name"],
            include: [
              {
                model: this.model.sequelize.model("Category"),
                as: "category",
                attributes: ["category_name"],
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async findDetailedProduct(productId) {
    try {
      return await this.model.findByPk(productId, {
        include: [
          // {
          //     model: this.model.sequelize.model('Company'),
          //     as: 'company',
          //     attributes: ['company_name', 'logo_url']
          // },
          {
            model: this.model.sequelize.model("ProductImage"),
            as: "images",
            attributes: ["image_url", "image_id", "product_id"],
          },
          {
            model: this.model.sequelize.model("SubCategory"),
            as: "subCategories",
            attributes: ["name"],
            include: [
              {
                model: this.model.sequelize.model("Category"),
                as: "category",
                attributes: ["category_name"],
              },
            ],
          },
        ],
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }
}

module.exports = new ProductRepository();
