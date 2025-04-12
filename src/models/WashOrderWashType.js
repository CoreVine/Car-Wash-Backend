const { Model, DataTypes } = require("sequelize");

class WashOrderWashType extends Model {
  static init(sequelize) {
    super.init(
      {
        order_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          references: {
            model: 'CarWashOrders',
            key: 'wash_order_id'
          },
          field: 'carwashorders_order_id'
        },
        type_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: {
            model: 'WashTypes',
            key: 'type_id'
          },
          field: 'WashTypes_type_id'
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
        indexes: [
          {
            unique: true,
            fields: ['carwashorders_order_id', 'WashTypes_type_id'],
            name: 'wash_order_type_unique'
          }
        ]
      }
    );
    
    return this;
  }

  static associate(models) {
    // This is a junction table, so no additional associations needed
  }
}

module.exports = WashOrderWashType;
