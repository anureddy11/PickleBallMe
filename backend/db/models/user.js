'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.belongsToMany(models.Group,{
        through:models.Member,
        foreignKey:'user_id',
        otherKey:'group_id'
      })

      User.belongsToMany(models.Event,{
        through:models.Attendee,
        foreignKey:'user_id',
        otherKey: 'event_id'
      })


    }
  };

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull:true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull:true
      }
    }, {
      sequelize,
      modelName: 'User',
      defaultScope:{
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
