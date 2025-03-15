import Sequelize, { Model } from "sequelize";

class CustomerCar extends Model {
  static init(sequelize) {
    super.init(
      {
        customer_car_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        model: {
          type: Sequelize.TEXT('tiny'),
          allowNull: false
        },
        car_plate_number: {
          type: Sequelize.TEXT('tiny'),
          allowNull: false
        },
        customer_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'user_id'
          }
        }
      },
      {
        sequelize,
        modelName: 'CustomerCar',
        tableName: 'CustomerCar',
        timestamps: false
      }
    );
    
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'customer_id',
      as: 'customer'
    });
    this.hasMany(models.CarWashOrder, {
      foreignKey: 'customer_car_id',
      as: 'washOrders'
    });
  }
}

export default CustomerCar;
