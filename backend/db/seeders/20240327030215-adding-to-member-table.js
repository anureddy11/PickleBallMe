'use strict';
const { Member,User,Group } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Member.bulkCreate([
      {
       group_id:1,
       user_id:1,
       status: 'active'
      },
      {
        group_id:2,
        user_id:1,
        status: 'inactive'

        },

      {
      group_id:1,
      user_id:2,
      status: 'active'

      },

      {
      group_id:3,
       user_id:3,
       status: 'inactive'
      }
     ], { ...options, validate: true })
  },

  async down (queryInterface, Sequelize) {

  }
};
