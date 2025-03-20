const { Model, DataTypes } = require("sequelize");

class SubCategory extends Model {
  static init(sequelize) {
    super.init(
      {
        sub_category_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        category_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Category',
            key: 'category_id'
          }
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'SubCategory',
        tableName: 'SubCategory',
        timestamps: false
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
    this.belongsToMany(models.Product, {
      through: models.SubCatProduct,
      foreignKey: 'sub_category_id',
      otherKey: 'product_id',
      as: 'products'
    });
  }
}

module.exports = SubCategory;

