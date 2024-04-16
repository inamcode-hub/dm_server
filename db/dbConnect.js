// db/dbconnect.js
const { Sequelize } = require('sequelize');

// Set up a new instance of Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',  // Assuming you are using PostgreSQL
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false // Turn off SQL logging in console
});

module.exports = sequelize;
