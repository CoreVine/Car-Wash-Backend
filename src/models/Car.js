const { Model, DataTypes } = require("sequelize");

class Car extends Model {
  static init(sequelize) {
    super.init(
      {
        car_id: {
          type: DataTypes.INTEGER.UNSIGNED,
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
        model: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        price_per_day: {
          type: DataTypes.DECIMAL(8, 2),
          allowNull: false
        },
        exhibition_id: {
          type: DataTypes.INTEGER.UNSIGNED,
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
        tableName: 'cars',
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

module.exports = Car;
