require('../config/main-config');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.database, process.env.username, process.env.password, {
    host: process.env.host,
    dialect: process.env.dialect,
    timezone: process.env.timezone
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });

module.exports = { Sequelize, sequelize };