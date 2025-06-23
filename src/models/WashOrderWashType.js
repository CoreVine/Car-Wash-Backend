const { Model, DataTypes } = require("sequelize");

class WashOrderWashType extends Model {
  static init(sequelize) {
    super.init(
      {
        order_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          field: 'carwashorders_order_id',
          references: {
            model: 'carwashorders',
            key: 'wash_order_id'
          },
        },
        type_id: {
          type: DataTypes.INTEGER,
          field: 'WashTypes_type_id',
          references: {
            model: 'washtypes',
            key: 'type_id'
          },
        },
        paid_price: {
          type: DataTypes.MEDIUMINT,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'WashOrderWashType',
        tableName: 'washorders_washtypes',
        timestamps: false,
        indexes: [],
        uniqueKeys: {
          wo_wt_pk: {
            fields: ['carwashorders_order_id', 'WashTypes_type_id']
          }
        }
      }
    );
    
    return this;
  }

  static associate(models) {
    this.belongsTo(models.CarWashOrder, {
      foreignKey: 'order_id',
      as: 'washOrder'
    });
    
    this.belongsTo(models.WashType, {
      foreignKey: 'type_id',
      as: 'washType'
    });
  }
}

module.exports = WashOrderWashType;
