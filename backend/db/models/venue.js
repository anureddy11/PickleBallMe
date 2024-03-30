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
        onDelete:'CASCADE',
        hooks:true
      }
      )

    }
  }
  Venue.init({
    group_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    address: {
      type:DataTypes.STRING,
      allowNull:false
    },
    city: {
      type:DataTypes.STRING,
      allowNull:false
    },
    state: {
      type:DataTypes.STRING,
      allowNull:false
    },
    lat: {
      type:DataTypes.FLOAT,
      allowNull:false
    },
    lng: {
      type:DataTypes.FLOAT,
      allowNull:false
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
