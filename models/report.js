'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      report.belongsTo(models.user, {
        foreignKey: 'user_id', onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  report.init({
    user_id: DataTypes.INTEGER,
    report_date: DataTypes.DATE,
    description: DataTypes.STRING,
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'report',
    paranoid: true
  });
  return report;
};