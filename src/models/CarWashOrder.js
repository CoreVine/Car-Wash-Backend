const { Model, DataTypes } = require("sequelize");

class CarWashOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        wash_order_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        order_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Orders',
            key: 'order_id'
          }
        },
        within_company: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          comment: 'if it is indoors or within company\'s workshop'
        },
        location: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        customer_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'user_id'
          }
        },
        customer_car_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'CustomerCar',
            key: 'customer_car_id'
          }
        }
      },
      {
        sequelize,
        modelName: 'CarWashOrder',
        tableName: 'carwashorders',
        timestamps: false
      }
    );
    
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order'
    });
    this.belongsTo(models.User, {
      foreignKey: 'customer_id',
      as: 'customer'
    });
    this.belongsTo(models.CustomerCar, {
      foreignKey: 'customer_car_id',
      as: 'customerCar'
    });
    this.hasOne(models.WashOrderOperation, {
      foreignKey: 'wash_order_id',
      as: 'operation'
    });
    this.belongsToMany(models.WashType, {
      through: models.WashOrderWashType,
      foreignKey: 'order_id',
      otherKey: 'type_id',
      as: 'washTypes'
    });
  }
}

module.exports = CarWashOrder;
