const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Company = sequelize.define('companies', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  website: {
    type: Sequelize.STRING,
    allowNull: true
  },
  industry: {
    type: Sequelize.STRING,
    allowNull: true
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  size: {
    type: Sequelize.STRING,
    allowNull: true
  },
  contactPerson: {
    type: Sequelize.STRING,
    allowNull: true
  },
  contactEmail: {
    type: Sequelize.STRING,
    allowNull: true
  },
  contactPhone: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

module.exports = Company;