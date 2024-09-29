const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const JobListing = sequelize.define('jobListings', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
},
company: {
  type: Sequelize.STRING,
  allowNull: false
},
location: {
  type: Sequelize.STRING,
  allowNull: true
},
description: {
  type: Sequelize.TEXT,
  allowNull: true
},
salary: {
  type: Sequelize.STRING,
  allowNull: true
},
applicationDeadline: {
  type: Sequelize.DATE,
  allowNull: true
},
jobUrl: {
  type: Sequelize.STRING,
  allowNull: true
}
});

module.exports = JobListing;