import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        acc_type: {
          type: Sequelize.ENUM('user', 'employee'),
          allowNull: false
        },
        profile_picture_url: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        name: {
          type: Sequelize.STRING(70),
          allowNull: false
        },
        username: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        password: Sequelize.VIRTUAL, // Virtual field that doesn't exist in the database
        password_hash: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        phone_number: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
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

export default User;
