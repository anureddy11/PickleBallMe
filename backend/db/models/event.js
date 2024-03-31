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
      allowNull: false, // Group ID cannot be null

    },
    venue_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Venue ID cannot be null

    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Name cannot be null

    },
    type: {
      type: DataTypes.STRING,
      allowNull: false, // Type cannot be null

    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false, // Start date cannot be null

    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false, // End date cannot be null

    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false, // Price cannot be null

    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false, // Capacity cannot be null

    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false, // Description cannot be null

    },
    preview_image: {
      type: DataTypes.STRING,
      allowNull: true // Preview image can be null
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
