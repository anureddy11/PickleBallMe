'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.belongsTo(
        models.Group,
        {foreignKey: 'group_id'}
      )

      Venue.hasMany(
        models.Event,
        {foreignKey: 'venue_id',
        // onDelete:'CASCADE',
        // hooks:true
      }
      )

    }
  }
  Venue.init({
    group_id: {
      type:DataTypes.INTEGER,
      allowNull:true
    },
    address: {
      type:DataTypes.STRING,
      allowNull:true
    },
    city: {
      type:DataTypes.STRING,
      allowNull:true
    },
    state: {
      type:DataTypes.STRING,
      allowNull:true
    },
    lat: {
      type:DataTypes.FLOAT,
      allowNull:true
    },
    lng: {
      type:DataTypes.FLOAT,
      allowNull:true
    },
    name: {
      type:DataTypes.STRING,
      allowNull:true
    },
  }, {
    sequelize,
    modelName: 'Venue',


  });
  return Venue;
};
