const { Model, DataTypes } = require("sequelize");

class OrderStatusHistory extends Model {
  static init(sequelize) {
    super.init(
      {
        status_history_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        order_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'order',
            key: 'id'
          }
        },
        status: {
          type: DataTypes.ENUM('pending', 'complete'),
          allowNull: false
        },
        timestamp: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      },
      {
        sequelize,
        modelName: 'OrderStatusHistory',
        tableName: 'orderstatushistory',
        timestamps: false
      }
    );
    
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
      onDelete: 'CASCADE'
    });
  }
}

module.exports = OrderStatusHistory;
