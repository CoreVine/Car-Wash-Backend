import Sequelize, { Model } from "sequelize";

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        category_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        category_name: {
          type: Sequelize.STRING(255),
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'Category',
        tableName: 'Category',
        timestamps: false
      }
    );
    
    return this;
  }

  static associate(models) {
    this.hasMany(models.SubCategory, {
      foreignKey: 'category_id',
      as: 'subCategories'
    });
  }
}

export default Category;
