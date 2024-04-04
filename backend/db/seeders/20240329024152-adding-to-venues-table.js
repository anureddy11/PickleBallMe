'use strict';
const { Member,User,Group,Venue } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {

    async up (queryInterface, Sequelize) {
      await Venue.bulkCreate([
        {
         group_id:1,
         address:'1432 Freeman Ln',
         city: 'Pleasanton',
         state:'CA',
         lat: 121.4,
         lng: 456.23,
         name: 'Bay Club Plesanton'
        },
        {
          group_id:1,
          address:'3456 Freeman Ln',
          city: 'Freemont',
          state:'CA',
          lat: 121.4,
          lng: 456.23,
          name: 'Bay Club Freemont'

          },

        {
          group_id:2,
         address:'1234 NY Streent',
         city: 'Pleasanton',
         state:'NY',
         lat: 121.4,
         lng: 456.23,
         name: 'Bay Club NY'

        },

        {
          group_id:3,
         address:'1956 AZ Stae',
         city: 'Tuscon',
         state:'AZ',
         lat: 121.4,
         lng: 456.23,
         name: 'Bay Club Arizona'
        }
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
