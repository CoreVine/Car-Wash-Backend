const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        acc_type: {
          type: DataTypes.ENUM('user', 'employee'),
          allowNull: false
        },
        profile_picture_url: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        name: {
          type: DataTypes.STRING(70),
          allowNull: false
        },
        username: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true
        },
        password: DataTypes.VIRTUAL, // Virtual field that doesn't exist in the database
        password_hash: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        phone_number: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        address: {
          type: DataTypes.TEXT,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    );

    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Order, {
      foreignKey: 'user_id',
      as: 'orders'
    });
    this.hasMany(models.CustomerCar, {
      foreignKey: 'customer_id',
      as: 'cars'
    });
    this.hasMany(models.Rating, {
      foreignKey: 'user_id',
      as: 'ratings'
    });
    this.belongsToMany(models.Company, {
      through: models.Employee,
      foreignKey: 'user_id',
      otherKey: 'company_id',
      as: 'companies'
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = User;
