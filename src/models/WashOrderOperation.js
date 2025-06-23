const { Model, DataTypes } = require("sequelize");

class WashOrderOperation extends Model {
  static init(sequelize) {
    super.init(
      {
        wash_order_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          references: {
            model: "carwashorders",
            key: "wash_order_id",
          },
        },
        employee_assigned_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: "employee",
            key: "user_id",
          },
        },
        operation_start_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        operation_done_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        company_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: "employee",
            key: "company_id",
          },
        },
        assignedEmployeeUserId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("cancelled", "progress", "delivered", "pending"),
          defaultValue: "pending",
        },
      },

      {
        sequelize,
        modelName: "WashOrderOperation",
        tableName: "washorderoperation",
        timestamps: false,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.CarWashOrder, {
      foreignKey: "wash_order_id",
      as: "washOrder",
    });
    this.belongsTo(models.Employee, {
      foreignKey: ["employee_assigned_id", "company_id"],
      as: "assignedEmployee",
    });
  }
}

module.exports = WashOrderOperation;
