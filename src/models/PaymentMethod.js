const { Model, DataTypes } = require("sequelize");

class PaymentMethod extends Model {
  static init(sequelize) {
    super.init(
      {
        payment_id: {
          type: DataTypes.TINYINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.TEXT('tiny'),
          allowNull: false
        },
        public_key: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        secret_key: {
          type: DataTypes.STRING(100),
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'PaymentMethod',
        tableName: 'paymentmethod',
        timestamps: false
      }
    );
    
    return this;
  }
  
  static associate(models) {
    this.hasMany(models.Order, {
      foreignKey: 'payment_method_id',
      as: 'orders'
    });
  }
}

module.exports = PaymentMethod;
