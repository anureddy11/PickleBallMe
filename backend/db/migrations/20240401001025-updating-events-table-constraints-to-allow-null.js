'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
  options.tableName = 'Events';  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Modify the Events table to allow null values for preview_image and venue_id columns
    await queryInterface.changeColumn('Events', 'preview_image', {
      type: Sequelize.STRING,
      allowNull: true, // Allow null values
    });

    await queryInterface.changeColumn('Events', 'venue_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // Allow null values
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert changes if necessary (not implemented in this example)
    // This down migration is provided as an example but may need to be modified according to your needs
    await queryInterface.changeColumn('Events', 'preview_image', {
      type: Sequelize.STRING,
      allowNull: false, // Revert to disallow null values
    });

    await queryInterface.changeColumn('Events', 'venue_id', {
      type: Sequelize.INTEGER,
      allowNull: false, // Revert to disallow null values
    });
  },
};
