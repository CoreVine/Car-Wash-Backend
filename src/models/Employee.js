const { Model, DataTypes } = require("sequelize");

class Employee extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          references: {
            model: 'users',
            key: 'user_id'
          }
        },
        company_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          references: {
            model: 'company',
            key: 'company_id'
          }
        },
        role: {
          type: DataTypes.ENUM('super-admin', 'manager', 'employee'),
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
        modelName: 'Employee',
        tableName: 'employee',
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

module.exports = Employee;