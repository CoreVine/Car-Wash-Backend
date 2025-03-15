import Sequelize, { Model } from "sequelize";

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        product_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        company_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Company',
            key: 'company_id'
          }
        },
        product_name: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        price: {
          type: Sequelize.DECIMAL(8, 2),
          allowNull: false
        },
        stock: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      },
      {
        sequelize,
        modelName: 'Product',
        tableName: 'Products',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });
    this.hasMany(models.OrderItem, {
      foreignKey: 'product_id',
      as: 'orderItems'
    });
    this.hasMany(models.ProductImage, {
      foreignKey: 'product_id',
      as: 'images'
    });
    this.belongsToMany(models.SubCategory, {
      through: models.SubCatProduct,
      foreignKey: 'product_id',
      otherKey: 'sub_category_id',
      as: 'subCategories'
    });
  }
}

export default Product;

