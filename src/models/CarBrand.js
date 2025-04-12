const { Model, DataTypes } = require("sequelize");

class CarBrand extends Model {
  static init(sequelize) {
    super.init(
      {
        brand_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING(45),
          allowNull: false
        },
        logo: {
          type: DataTypes.STRING(255),
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'CarBrand',
        tableName: 'carbrand',
        timestamps: false
      }
    );
    
    return this;
  }

  static associate(models) {
    this.hasMany(models.Car, {
      foreignKey: 'carbrand_id',
      as: 'cars'
    });
  }
}

module.exports = CarBrand;
