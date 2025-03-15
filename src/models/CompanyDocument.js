import Sequelize, { Model } from "sequelize";

class CompanyDocument extends Model {
  static init(sequelize) {
    super.init(
      {
        document_id: {
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
        document_type: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        document_url: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        upload_date: {
          type: Sequelize.DATE,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'CompanyDocument',
        tableName: 'CompanyDocuments',
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
  }
}

export default CompanyDocument;
