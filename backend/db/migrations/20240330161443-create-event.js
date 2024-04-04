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
        onDelete:'Cascade'
      },
      venue_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:'Venues',
          key:'id'
        },
        onDelete:'Cascade'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price:{
        type:Sequelize.FLOAT,
        allowNull:true,
      },
      capacity:{
        type:sequelize.INTEGER,
        allowNull:true
      },
      description:{
        type:sequelize.STRING,
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
