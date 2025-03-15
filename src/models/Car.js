import Sequelize, { Model } from "sequelize";

class Car extends Model {
  static init(sequelize) {
    super.init(
      {
        car_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        company_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Company',
            key: 'company_id'
          }
        },
        model: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        year: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        price_per_day: {
          type: Sequelize.DECIMAL(8, 2),
          allowNull: false
        },
        exhibition_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'CompanyExhibition',
            key: 'exhibition_id'
          }
        }
      },
      {
        sequelize,
        modelName: 'Car',
        tableName: 'Cars',
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
    this.belongsTo(models.CompanyExhibition, {
      foreignKey: 'exhibition_id',
      as: 'exhibition'
    });
    this.hasMany(models.RentalOrder, {
      foreignKey: 'car_id',
      as: 'rentalOrders'
    });
    this.hasMany(models.RentalCarImage, {
      foreignKey: 'car_id',
      as: 'images'
    });
  }
}

export default Car;
