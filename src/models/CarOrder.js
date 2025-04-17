const { Model, DataTypes } = require("sequelize");

class CarOrders extends Model {
  static init(sequelize) {
    super.init({
      car_order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      car_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      orders_order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'CarOrders',
      tableName: 'carorders',
      timestamps: false
    });
    
    return this;
  }

  static associate(models) {
    CarOrders.belongsTo(models.Cart, {
      foreignKey: 'orders_order_id',
      as: 'cart'
    });
    
    CarOrders.belongsTo(models.Car, {
      foreignKey: 'car_id',
      as: 'car'
    });
  }
}

module.exports = CarOrders;
