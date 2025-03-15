import Sequelize, { Model } from "sequelize";

class RentalCarImage extends Model {
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
        car_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Cars',
            key: 'car_id'
          }
        }
      },
      {
        sequelize,
        modelName: 'RentalCarImage',
        tableName: 'RentalCarsImages',
        timestamps: false
      }
    );
    
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Car, {
      foreignKey: 'car_id',
      as: 'car'
    });
  }
}

export default RentalCarImage;

