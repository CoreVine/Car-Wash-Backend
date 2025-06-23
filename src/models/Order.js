const { Model, DataTypes } = require("sequelize");

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        cart_order_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'cart',
            key: 'order_id'
          }
        },
        payment_method_id: {
          type: DataTypes.TINYINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'paymentmethod',
            key: 'payment_id'
          }
        },
        payment_gateway_response: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        shipping_address: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        company_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
          references: {
            model: 'company',
            key: 'company_id'
          }
        },
        user_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
          references: {
            model: 'user',
            key: 'user_id'
          }
        }
      },
      {
        sequelize,
        modelName: 'Order',
        tableName: 'order',
        timestamps: false
      }
    );
    
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Cart, {
      foreignKey: 'cart_order_id',
      as: 'cart',
      onDelete: 'CASCADE'
    });
    this.belongsTo(models.PaymentMethod, {
      foreignKey: 'payment_method_id',
      as: 'paymentMethod'
    });
    this.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    this.hasMany(models.OrderStatusHistory, {
      foreignKey: 'order_id',
      as: 'statusHistory',
      onDelete: 'CASCADE'
    });
  }
}

module.exports = Order;
