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
            model: 'category',
            key: 'category_id'
          }
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        icon: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: 'URL, font icon class, or file path for subcategory icon'
        }
      },
      {
        sequelize,
        modelName: 'SubCategory',
        tableName: 'subcategory',
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
    // Add direct association to SubCatProduct
    this.hasMany(models.SubCatProduct, {
      foreignKey: 'sub_category_id',
      as: 'subCatProducts'
    });
  }
}

module.exports = SubCategory;

