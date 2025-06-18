const { Model, DataTypes } = require("sequelize");

class RentalOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        rental_order_id: {
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
        car_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: "Cars",
            key: "car_id",
          },
        },
        start_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        end_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM("cancelled", "progress", "delivered", "pending"),
          defaultValue: "pending",
        },
      },
      {
        sequelize,
        modelName: "RentalOrder",
        tableName: "rentalorders",
        timestamps: false,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Cart, {
      foreignKey: "order_id",
      as: "cart",
    });

    this.belongsTo(models.Car, {
      foreignKey: "car_id",
      as: "car",
    });
  }
}

module.exports = RentalOrder;
