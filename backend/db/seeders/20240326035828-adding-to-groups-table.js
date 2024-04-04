'use strict';

const { Group } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await Group.bulkCreate([
    {
      organizer_id:1,
      name:'1bay-club-starz',
      about:'Above 4.0 in Bay Club Pleasanton',
      type: 'Advanced',
      private: true,
      city: 'Pleasanton',
      state: 'CA'

    },

    {
      organizer_id:2,
      name:'1bay-club-starters',
      about:'Above 2.0 in Bay Club Pleasanton',
      type: 'Beginner',
      private: false,
      city: 'Pleasanton',
      state: 'CA'

    },

    {
      organizer_id:3,
      name:'1ny-bay-club-champs',
      about:'Above 4.0 in Bay Club NY',
      type: 'Advanced',
      private: true,
      city: 'NY City',
      state: 'NY'
    }
   ], { ...options, validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['bay-club-starz', 'bay-club-starters', 'ny-bay-club-champs'] }
    }, options);
  }
};
