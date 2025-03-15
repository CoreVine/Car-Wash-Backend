import Sequelize, { Model } from "sequelize";

class CompanyExhibition extends Model {
  static init(sequelize) {
    super.init(
      {
        exhibition_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        location: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        company_id: {
          type: Sequelize.INTEGER.UNSIGNED,
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
        tableName: 'CompanyExhibition',
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
      as: 'cars'
    });
  }
}

export default CompanyExhibition;
