'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
  options.tableName = 'Venues';  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await   queryInterface.addConstraint('Venues',{
        fields: ['group_id'],
        type: 'foreign key',
        name: 'venue_groupId_fk',
        references:{
          table:'Groups',
          field: 'id'
        },
        onDelete: 'CASCADE'

    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Venue', 'venue_groupId_fk');
  }
};
