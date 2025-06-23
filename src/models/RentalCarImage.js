const { Model, DataTypes } = require("sequelize");

class RentalCarImage extends Model {
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
        car_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'cars',
            key: 'car_id'
          }
        }
      },
      {
        sequelize,
        modelName: 'RentalCarImage',
        tableName: 'rentalcarsimages',
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

module.exports = RentalCarImage;

