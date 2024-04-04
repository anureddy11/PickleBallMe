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
  await EventImages.bulkCreate([
    {
      preview_image:true,
      event_id:2,
      image_url: 'xyz'
     },
     {
      preview_image:false,
      event_id:2,
      image_url: 'abc'
      },
      {
        preview_image:true,
        event_id:3,
        image_url: '2xyz'
       },
       {
        preview_image:false,
        event_id:3,
        image_url: '2abc'
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
