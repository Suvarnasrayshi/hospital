'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      medication.belongsTo(models.user, {
        foreignKey: 'user_id', onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      medication.hasMany(models.reminder, {
        foreignKey: 'medication_id', onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  medication.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.STRING,
    rec_type:DataTypes.STRING,
    date: DataTypes.DATE,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    time: DataTypes.TIME,
    day_week: DataTypes.STRING,
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'medication',
    paranoid: true
  });
  return medication;
};