const { Model, DataTypes } = require("sequelize");

class CompanyExhibition extends Model {
  static init(sequelize) {
    super.init(
      {
        exhibition_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        location: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        company_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'Company',
            key: 'company_id'
          }
        }
      },
      {
        sequelize,
        modelName: 'CompanyExhibition',
        tableName: 'companyexhibition',
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
    this.hasMany(models.Car, {
      foreignKey: 'exhibition_id',
      as: 'cars',
      onDelete: 'CASCADE', // Changed from RESTRICT to CASCADE to delete all associated cars
      onUpdate: 'CASCADE'
    });
  }
}

module.exports = CompanyExhibition;
