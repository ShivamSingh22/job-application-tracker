const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('users',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull:false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // New fields for profile management
    firstName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    careerGoals: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

module.exports = User;