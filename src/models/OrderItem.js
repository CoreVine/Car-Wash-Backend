const { Model, DataTypes } = require("sequelize");

class OrderItem extends Model {
  static init(sequelize) {
    super.init(
      {
        order_item_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        order_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: "Cart",
            key: "order_id",
          },
        },
        product_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: "Products",
            key: "product_id",
          },
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(8, 2),
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM("cancelled", "progress", "delivered", "pending"),
          defaultValue: "pending",
        },
      },
      {
        sequelize,
        modelName: "OrderItem",
        tableName: "orderitems",
        timestamps: false,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
      onDelete: "CASCADE",
    });
    this.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });
  }
}

module.exports = OrderItem;
