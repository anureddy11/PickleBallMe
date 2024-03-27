'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsToMany(models.User,{
        through:models.Member,
        foreignKey:'group_id',
        otherKey:'user_id'
      })

      Group.hasMany(
        models.GroupImage,
        {foreignKey: 'group_id',
        onDelete:'CASCADE',
        hooks:true
      }
      )
    }
  }
  Group.init({
    organizer_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      unique: true
    },
    about: {
      type:DataTypes.STRING,
      allowNull:false
    },
    type: {
      type:DataTypes.STRING,
      allowNull:false
    },

    private: {
      type:DataTypes.BOOLEAN,
      allowNull:false
    },

    city: {
      type:DataTypes.STRING,
      allowNull:false
    },

    state: {
      type:DataTypes.STRING,
      allowNull:false
    }

  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
