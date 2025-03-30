const { Model, DataTypes } = require("sequelize");

class ProductImage extends Model {
  static init(sequelize) {
    super.init(
      {
        image_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        image_url: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        product_id: {
          type: DataTypes.INTEGER.UNSIGNED,
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
        tableName: 'productsimages',
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

module.exports = ProductImage;

