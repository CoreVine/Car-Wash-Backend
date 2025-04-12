const { Model, DataTypes } = require("sequelize");

class WashType extends Model {
  static init(sequelize) {
    super.init(
      {
        type_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        company_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Company',
            key: 'company_id'
          }
        },
        name: {
          type: DataTypes.STRING(45),
          allowNull: false
        },
        price: {
          type: DataTypes.MEDIUMINT,
          allowNull: false
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'WashType',
        tableName: 'washtypes',
        timestamps: false
      }
    );
    
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });
    this.belongsToMany(models.CarWashOrder, {
      through: models.WashOrderWashType,
      foreignKey: 'type_id',
      otherKey: 'order_id',
      as: 'washOrders'
    });
  }
}

module.exports = WashType;
