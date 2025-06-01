const { Model, DataTypes } = require("sequelize");

class CarWashOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        wash_order_id: {
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
        within_company: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          comment: "if it is indoors or within company's workshop",
        },
        location: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        customer_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: "Users",
            key: "user_id",
          },
        },
        company_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: "Company",
            key: "company_id",
          },
        },
      },
      {
        sequelize,
        modelName: "CarWashOrder",
        tableName: "carwashorders",
        timestamps: false,
        indexes: [
          {
            name: "order_id",
            fields: ["order_id"],
          },
          {
            name: "customer_id",
            fields: ["customer_id"],
          },
          {
            name: "fk_carwashorders_company1_idx",
            fields: ["company_id"],
          },
        ],
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Cart, {
      foreignKey: "order_id",
      as: "order",
    });
    this.belongsTo(models.User, {
      foreignKey: "customer_id",
      as: "customer",
      onDelete: "CASCADE",
    });
    this.belongsTo(models.Company, {
      foreignKey: "company_id",
      as: "company",
    });
    this.hasOne(models.WashOrderOperation, {
      foreignKey: "wash_order_id",
      as: "operation",
    });
    this.belongsToMany(models.WashType, {
      through: models.WashOrderWashType,
      foreignKey: "carwashorders_order_id",
      otherKey: "WashTypes_type_id",
      as: "washTypes",
    });
  }
}

module.exports = CarWashOrder;
