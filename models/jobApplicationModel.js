const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const JobApplication = sequelize.define('jobApplications', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  companyName: {
    type: Sequelize.STRING,
    allowNull: false,
    collate: 'utf8_general_ci'  // Add this line
  },
  jobTitle: {
    type: Sequelize.STRING,
    allowNull: false,
    collate: 'utf8_general_ci'  // Add this line
  },
  applicationDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('applied', 'interviewed', 'offered', 'rejected'),
    defaultValue: 'applied'
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  attachmentUrl: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

module.exports = JobApplication;