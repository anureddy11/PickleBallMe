'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('Users','firstName', {
        type:Sequelize.STRING,
        allowNull: true
    })

    await queryInterface.addColumn('Users','lastName', {
      type:Sequelize.STRING,
      allowNull: true
  })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'firstname');
    await queryInterface.removeColumn('Users', 'lastname');
  }
};
