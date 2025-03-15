import Sequelize, { Model } from "sequelize";

class Rating extends Model {
  static init(sequelize) {
    super.init(
      {
        company_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          references: {
            model: 'Company',
            key: 'company_id'
          }
        },
        user_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          references: {
            model: 'Users',
            key: 'user_id'
          }
        },
        rating_value: {
          type: Sequelize.DECIMAL(8, 2),
          allowNull: false
        },
        review_text: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      },
      {
        sequelize,
        modelName: 'Rating',
        tableName: 'Ratings',
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

export default Rating;

