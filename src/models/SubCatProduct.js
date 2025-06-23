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
            model: 'products',
            key: 'product_id'
          }
        },
        sub_category_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'subcategory',
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
    // Add associations to both Product and SubCategory
    this.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
    
    this.belongsTo(models.SubCategory, {
      foreignKey: 'sub_category_id',
      as: 'subCategory'
    });
  }
}

module.exports = SubCatProduct;

