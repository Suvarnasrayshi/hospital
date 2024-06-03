'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.medication, {
        foreignKey: 'user_id', onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      user.hasMany(models.report, {
        foreignKey: 'user_id', onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      user.hasMany(models.session, { foreignKey: 'user_id', onDelete: 'CASCADE',
       onUpdate: 'CASCADE'
       });
    }
  }
  user.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'user',
    paranoid: true,
    hooks: {
      beforeCreate: (user) => {
        user.username = user.username.toLowerCase();
        if (user.password) {
          const salt = bcrypt.genSaltSync(10, 'a');
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },
    }
  });
  return user;
};