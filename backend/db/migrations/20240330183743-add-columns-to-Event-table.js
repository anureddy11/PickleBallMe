'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Events', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Events', 'price', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('Events', 'capacity', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Events', 'description');
    await queryInterface.removeColumn('Events', 'price');
    await queryInterface.removeColumn('Events', 'capacity');
  }
};
