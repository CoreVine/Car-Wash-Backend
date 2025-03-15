import Sequelize, { Model } from "sequelize";

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        order_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'user_id'
          }
        },
        company_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Company',
            key: 'company_id'
          }
        },
        order_type: {
          type: Sequelize.ENUM('product', 'wash', 'rental'),
          allowNull: false
        },
        order_date: {
          type: Sequelize.DATE,
          allowNull: false
        },
        total_amount: {
          type: Sequelize.DECIMAL(8, 2),
          allowNull: false
        },
        payment_method_id: {
          type: Sequelize.TINYINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'PaymentMethod',
            key: 'payment_id'
          }
        },
        payment_gateway_response: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        shipping_address: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
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

export default Order;
