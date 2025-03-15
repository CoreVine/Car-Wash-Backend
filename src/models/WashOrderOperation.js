import Sequelize, { Model } from "sequelize";

class WashOrderOperation extends Model {
  static init(sequelize) {
    super.init(
      {
        wash_order_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          references: {
            model: 'CarWashOrders',
            key: 'wash_order_id'
          }
        },
        employee_assigned_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Employee',
            key: 'user_id'
          }
        },
        operation_start_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        operation_done_at: {
          type: Sequelize.DATE,
          allowNull: true
        },
        company_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Employee',
            key: 'company_id'
          }
        }
      },
      {
        sequelize,
        modelName: 'WashOrderOperation',
        tableName: 'WashOrderOperation',
        timestamps: false
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.CarWashOrder, {
      foreignKey: 'wash_order_id',
      as: 'washOrder'
    });
    this.belongsTo(models.Employee, {
      foreignKey: ['employee_assigned_id', 'company_id'],
      as: 'assignedEmployee'
    });
  }
}

export default WashOrderOperation;

