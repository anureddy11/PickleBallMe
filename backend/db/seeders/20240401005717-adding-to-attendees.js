'use strict';
const { Member,User,Group,Venue,Event,Attendee,EventImages } = require('../models');
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
        event_id:2,
        status:"Yes"
       },
       {
        user_id:1,
        event_id:3,
        status:"Yes"
       },
       {
        user_id:1,
        event_id:4,
        status:"Yes"
       },
       {
        user_id:1,
        event_id:5,
        status:"Yes"
       },
       {
        user_id:1,
        event_id:6,
        status:"Yes"
       },
       {
        user_id:2,
        event_id:2,
        status:"Yes"
       },
       {
        user_id:2,
        event_id:3,
        status:"Yes"
       },
       {
        user_id:3,
        event_id:4,
        status:"Yes"
       },
       {
        user_id:3,
        event_id:5,
        status:"Yes"
       },
       {
        user_id:4,
        event_id:6,
        status:"Yes"
       },

      ])
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
