import Sequelize, { Model } from "sequelize";

class PaymentMethod extends Model {
  static init(sequelize) {
    super.init(
      {
        payment_id: {
          type: Sequelize.TINYINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.TEXT('tiny'),
          allowNull: false
        },
        public_key: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        secret_key: {
          type: Sequelize.STRING(100),
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'PaymentMethod',
        tableName: 'PaymentMethod',
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

export default PaymentMethod;

