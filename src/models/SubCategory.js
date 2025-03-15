import Sequelize, { Model } from "sequelize";

class SubCategory extends Model {
  static init(sequelize) {
    super.init(
      {
        sub_category_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        category_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Category',
            key: 'category_id'
          }
        },
        name: {
          type: Sequelize.STRING(255),
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

export default SubCategory;

