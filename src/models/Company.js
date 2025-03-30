const { Model, DataTypes } = require("sequelize");

class Company extends Model {
  static init(sequelize) {
    super.init(
      {
        company_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        company_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true
        },
        phone_number: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        location: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        logo_url: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        password_hash: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        approved: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        about: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        total_rating: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 0
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      },
      {
        sequelize,
        modelName: 'Company',
        tableName: 'company',
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

module.exports = Company;
