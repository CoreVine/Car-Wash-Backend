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
        sale_or_rental: {
          type: DataTypes.ENUM('sale', 'rent'),
          allowNull: false
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
        price: {
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
        },
        carbrand_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'CarBrand',
            key: 'brand_id'
          }
        },
        description: {
          type: DataTypes.STRING(255),
          allowNull: true
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
    this.belongsTo(models.CarBrand, {
      foreignKey: 'carbrand_id',
      as: 'brand'
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
