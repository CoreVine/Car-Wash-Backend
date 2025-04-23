const { Model, DataTypes } = require("sequelize");

class Cart extends Model {
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
        status: {
          type: DataTypes.ENUM('cart', 'pending', 'complete'),
          allowNull: false,
          defaultValue: 'cart'
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
        modelName: 'Cart',
        tableName: 'cart',
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
      as: 'user',
      onDelete: 'CASCADE'
    });
    this.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'orderItems',
      onDelete: 'CASCADE'
    });
    this.hasOne(models.CarWashOrder, {
      foreignKey: 'order_id',
      as: 'carWashOrder',
      onDelete: 'CASCADE'
    });
    this.hasOne(models.RentalOrder, {
      foreignKey: 'order_id',
      as: 'rentalOrder',
      onDelete: 'CASCADE'
    });
    this.hasOne(models.Order, {
      foreignKey: 'cart_order_id',
      as: 'order',
      onDelete: 'CASCADE'
    });
    this.hasOne(models.CarOrders, {
      foreignKey: 'orders_order_id',
      as: 'carOrder',
      onDelete: 'CASCADE'
    });
  }
}

module.exports = Cart;
