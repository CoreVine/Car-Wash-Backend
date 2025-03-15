import Sequelize, { Model } from "sequelize";

class Employee extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          references: {
            model: 'Users',
            key: 'user_id'
          }
        },
        company_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          references: {
            model: 'Company',
            key: 'company_id'
          }
        },
        role: {
          type: Sequelize.ENUM('super-admin', 'manager', 'employee'),
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
        modelName: 'Employee',
        tableName: 'Employee',
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
    this.hasMany(models.WashOrderOperation, {
      foreignKey: 'employee_assigned_id',
      as: 'washOperations'
    });
  }
}

export default Employee;
