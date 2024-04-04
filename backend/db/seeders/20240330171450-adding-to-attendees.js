'use strict';
const { Member,User,Group,Venue,Event,Attendee } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {

    async up (queryInterface, Sequelize) {
      await Attendee.bulkCreate([
        {
         user_id:1,
         event_id:1,
         status:"member"
        },
        {
          user_id:1,
          event_id:2,
          status:"member"
         },
         {
          user_id:2,
          event_id:1,
          status:"member"
         },
         {
          user_id:2,
          event_id:2,
          status:"member"
         },
         {
          user_id:3,
          event_id:1,
          status:"member"
         },
         {
          user_id:4,
          event_id:1,
          status:"member"
         },




       ], { ...options, validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
