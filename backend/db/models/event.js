'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsToMany(models.User,{
        through:models.Attendee,
        foreignKey:'event_id',
        otherKey:'user_id'
      })

      Event.belongsTo(
        models.Venue,
        {foreignKey: 'venue_id'}
      )

      Event.belongsTo(
        models.Group,
        {foreignKey: 'group_id'}
      )
    }
  }
  Event.init({
    group_id: DataTypes.INTEGER,
    venue_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    preview_image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
