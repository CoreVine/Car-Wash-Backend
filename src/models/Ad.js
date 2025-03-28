const { Model, DataTypes } = require("sequelize");

class Ad extends Model {
  static init(sequelize) {
    super.init(
      {
        ad_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        image_url: {
          type: DataTypes.STRING(255),
          allowNull: false
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
        modelName: 'Ad',
        tableName: 'Ads',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );
    
    return this;
  }

  static associate(models) {
    // No associations needed for this model
  }
}

module.exports = Ad;
