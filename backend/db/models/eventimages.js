'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventImages.belongsTo(
        models.Event,
        {foreignKey:'event_id'}

      )
    }
  }
  EventImages.init({
    preview_image: DataTypes.BOOLEAN,
    image_url: DataTypes.STRING,
    event_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EventImages',
  });
  return EventImages;
};
