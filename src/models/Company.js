import Sequelize, { Model } from "sequelize";

class Company extends Model {
  static init(sequelize) {
    super.init(
      {
        company_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        company_name: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        phone_number: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        location: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        logo_url: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        password_hash: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        approved: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      },
      {
        sequelize,
        modelName: 'Company',
        tableName: 'Company',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );
    
    return this;
  }

  static associate(models) {
    this.hasMany(models.CompanyDocument, {
      foreignKey: 'company_id',
      as: 'documents'
    });
    this.hasMany(models.Product, {
      foreignKey: 'company_id',
      as: 'products'
    });
    this.hasMany(models.Order, {
      foreignKey: 'company_id',
      as: 'orders'
    });
    this.hasMany(models.Car, {
      foreignKey: 'company_id',
      as: 'cars'
    });
    this.hasMany(models.CompanyExhibition, {
      foreignKey: 'company_id',
      as: 'exhibitions'
    });
    this.hasMany(models.Rating, {
      foreignKey: 'company_id',
      as: 'ratings'
    });
    this.belongsToMany(models.User, {
      through: models.Employee,
      foreignKey: 'company_id',
      otherKey: 'user_id',
      as: 'employees'
    });
  }
}

export default Company;
