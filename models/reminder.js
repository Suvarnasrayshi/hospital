'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reminder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      reminder.belongsTo(models.medication, {
        foreignKey: 'medication_id', onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  reminder.init({
    medication_id: DataTypes.INTEGER,
    reminder_at: DataTypes.DATE,
    status: DataTypes.STRING,
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'reminder',
    paranoid: true
  });
  return reminder;
};