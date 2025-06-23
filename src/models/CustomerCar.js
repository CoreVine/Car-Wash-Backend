const { Model, DataTypes } = require("sequelize");

class CustomerCar extends Model {
  static init(sequelize) {
    super.init(
      {
        customer_car_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        model: {
          type: DataTypes.TEXT('tiny'),
          allowNull: false
        },
        car_plate_number: {
          type: DataTypes.TEXT('tiny'),
          allowNull: false
        },
        customer_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'users',
            key: 'user_id'
          }
        }
      },
      {
        sequelize,
        modelName: 'CustomerCar',
        tableName: 'customercar',
        timestamps: false
      }
    );
    
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'customer_id',
      as: 'customer',
      onDelete: 'CASCADE'
    });
    // FUTURE FU-001
    // this.hasMany(models.CarWashOrder, {
    //   foreignKey: 'customer_car_id',
    //   as: 'washOrders'
    // });
  }
}

module.exports = CustomerCar;
