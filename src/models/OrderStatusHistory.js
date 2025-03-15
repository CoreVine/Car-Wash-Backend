import Sequelize, { Model } from "sequelize";

class OrderStatusHistory extends Model {
  static init(sequelize) {
    super.init(
      {
        status_history_id: {
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
        status: {
          type: Sequelize.ENUM('pending', 'complete'),
          allowNull: false
        },
        timestamp: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      },
      {
        sequelize,
        modelName: 'OrderStatusHistory',
        tableName: 'OrderStatusHistory',
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
  }
}

export default OrderStatusHistory;
