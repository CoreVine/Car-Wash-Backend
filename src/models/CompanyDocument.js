const { Model, DataTypes } = require("sequelize");

class CompanyDocument extends Model {
  static init(sequelize) {
    super.init(
      {
        document_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        company_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'company',
            key: 'company_id'
          }
        },
        document_type: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        document_url: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        upload_date: {
          type: DataTypes.DATE,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'CompanyDocument',
        tableName: 'companydocuments',
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

module.exports = CompanyDocument;
