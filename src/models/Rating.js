const { Model, DataTypes } = require("sequelize");

class Rating extends Model {
  static init(sequelize) {
    super.init(
      {
        company_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          references: {
            model: 'Company',
            key: 'company_id'
          }
        },
        user_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          references: {
            model: 'Users',
            key: 'user_id'
          }
        },
        rating_value: {
          type: DataTypes.DECIMAL(8, 2),
          allowNull: false
        },
        review_text: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      },
      {
        sequelize,
        modelName: 'Rating',
        tableName: 'ratings',
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
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}

module.exports = Rating;

