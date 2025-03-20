const { Model, DataTypes } = require("sequelize");

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        order_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'user_id'
          }
        },
        company_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Company',
            key: 'company_id'
          }
        },
        order_type: {
          type: DataTypes.ENUM('product', 'wash', 'rental'),
          allowNull: false
        },
        order_date: {
          type: DataTypes.DATE,
          allowNull: false
        },
        total_amount: {
          type: DataTypes.DECIMAL(8, 2),
          allowNull: false
        },
        payment_method_id: {
          type: DataTypes.TINYINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'PaymentMethod',
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
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      },
      {
        sequelize,
        modelName: 'Order',
        tableName: 'Orders',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );
    
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    this.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });
    this.belongsTo(models.PaymentMethod, {
      foreignKey: 'payment_method_id',
      as: 'paymentMethod'
    });
    this.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'orderItems'
    });
    this.hasOne(models.CarWashOrder, {
      foreignKey: 'order_id',
      as: 'carWashOrder'
    });
    this.hasOne(models.RentalOrder, {
      foreignKey: 'order_id',
      as: 'rentalOrder'
    });
    this.hasMany(models.OrderStatusHistory, {
      foreignKey: 'order_id',
      as: 'statusHistory'
    });
  }
}

module.exports = Order;
