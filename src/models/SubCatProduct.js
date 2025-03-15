import Sequelize, { Model } from "sequelize";

class SubCatProduct extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        product_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Products',
            key: 'product_id'
          }
        },
        sub_category_id: {
          type: Sequelize.INTEGER.UNSIGNED,
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
        tableName: 'SubCatProduct',
        timestamps: false
      }
    );
    
    return this;
  }

  static associate(models) {
    // This is a join table, so no additional associations needed
  }
}

export default SubCatProduct;

