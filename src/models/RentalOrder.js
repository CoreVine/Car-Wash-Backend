import Sequelize, { Model } from "sequelize";

class RentalOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        rental_order_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        order_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Orders',
            key: 'order_id'
          }
        },
        car_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Cars',
            key: 'car_id'
          }
        },
        start_date: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        end_date: {
          type: Sequelize.DATEONLY,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'RentalOrder',
        tableName: 'RentalOrders',
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
    this.belongsTo(models.Car, {
      foreignKey: 'car_id',
      as: 'car'
    });
  }
}

export default RentalOrder;

