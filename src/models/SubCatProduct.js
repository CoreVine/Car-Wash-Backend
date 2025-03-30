const { Model, DataTypes } = require("sequelize");

class SubCatProduct extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        product_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Products',
            key: 'product_id'
          }
        },
        sub_category_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'SubCategory',
            key: 'sub_category_id'
          }
        }
      },
      {
        sequelize,
        modelName: 'SubCatProduct',
        tableName: 'subcatproduct',
        timestamps: false
      }
    );
    
    return this;
  }

  static associate(models) {
    // This is a join table, so no additional associations needed
  }
}

module.exports = SubCatProduct;

