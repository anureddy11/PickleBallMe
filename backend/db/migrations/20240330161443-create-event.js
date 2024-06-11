'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
  options.tableName = 'Events';  // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:'Groups',
          key:'id'
        },
        onDelete:'CASCADE'
      },
      venue_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references:{
        //   model:'Venues',
        //   key:'id'
        // },
        onDelete:'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      price:{
        type:Sequelize.FLOAT,
        allowNull:true,
      },
      capacity:{
        type: Sequelize.INTEGER,
        allowNull:true
      },
      description:{
        type: Sequelize.STRING,
        allowNull:true
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      preview_image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },options);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Events');
  }
};
