const { Model, DataTypes } = require("sequelize");

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        category_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        category_name: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        icon: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: 'URL, font icon class, or file path for category icon'
        }
      },
      {
        sequelize,
        modelName: 'Category',
        tableName: 'category',
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

module.exports = Category;
