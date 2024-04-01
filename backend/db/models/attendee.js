'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Attendee.init({
    user_id: DataTypes.INTEGER,
    event_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'Attendee',
  });
  return Attendee;
};
