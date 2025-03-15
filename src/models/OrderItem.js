import Sequelize, { Model } from "sequelize";

class OrderItem extends Model {
  static init(sequelize) {
    super.init(
      {
        order_item_id: {
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
        product_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Products',
            key: 'product_id'
          }
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        price: {
          type: Sequelize.DECIMAL(8, 2),
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'OrderItems',
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
    this.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  }
}

export default OrderItem;
