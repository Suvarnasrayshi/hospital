'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      session.belongsTo(models.user, { foreignKey: 'user_id', onDelete: 'CASCADE',
        onUpdate:'CASCADE'
       });
    }
  }
  session.init({
    user_id: DataTypes.INTEGER,
    session_token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'session',
    paranoid: true
  });
  return session;
};