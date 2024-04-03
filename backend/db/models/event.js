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

      Event.hasMany(
        models.EventImages,
        {
          foreignKey:'event_id',
          onDelete:'CASCADE',
          hooks:true
        }
      )

    }
  }
  Event.init({
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    venue_id: {
      type: DataTypes.INTEGER,
      allowNull: true,

    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,

    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,

    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,

    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,

    },
    preview_image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
