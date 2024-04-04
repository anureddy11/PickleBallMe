'use strict';
const { Member,User,Group,Venue,Event } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {

    async up (queryInterface, Sequelize) {
      await Event.bulkCreate([
        {
         group_id:1,
         venue_id:1,
         name:'fake event 1',
         price: 24.5,
         capacity: 400,
         type: 'recreational',
         start_date: '2024-03-01',
         description:'abc',
         end_date: '2024-04-01',
         preview_image: 'no',
        },
        {
          group_id:1,
          venue_id:2,
          name:'fake event 2',
          type: 'competetive',
          price: 24.5,
          capacity: 400,
          description:'abc',
          start_date: '2024-03-01',
         end_date: '2024-04-01',
          preview_image: 'no',
         },
         {
          group_id:2,
          venue_id:1,
          name:'fake event 3',
          type: 'recreational',
          price: 24.5,
          capacity: 400,
          description:'abc',
          start_date: '2024-03-01',
         end_date: '2024-04-01',
          preview_image: 'no',
         },
         {
           group_id:2,
           venue_id:2,
           name:'fake event 4',
           type: 'competetive',
           price: 24.5,
           capacity: 400,
           description:'abc',
           start_date: '2024-03-01',
          end_date: '2024-04-01',
           preview_image: 'no',
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
