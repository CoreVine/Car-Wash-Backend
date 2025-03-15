import Sequelize, { Model } from "sequelize";

class ProductImage extends Model {
  static init(sequelize) {
    super.init(
      {
        image_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        image_url: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        product_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Products',
            key: 'product_id'
          }
        }
      },
      {
        sequelize,
        modelName: 'ProductImage',
        tableName: 'ProductsImages',
        timestamps: false
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  }
}

export default ProductImage;

