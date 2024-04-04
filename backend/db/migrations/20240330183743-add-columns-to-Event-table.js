'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
  options.tableName = 'Events';  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Events', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    },options);

    await queryInterface.addColumn('Events', 'price', {
      type: Sequelize.FLOAT,
      allowNull: true
    },options);

    await queryInterface.addColumn('Events', 'capacity', {
      type: Sequelize.INTEGER,
      allowNull: true
    },options);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Events', 'description');
    await queryInterface.removeColumn('Events', 'price');
    await queryInterface.removeColumn('Events', 'capacity');
  }
};
