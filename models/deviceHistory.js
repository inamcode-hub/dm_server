// models/deviceHistory.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/dbConnect');  // Adjust the path as necessary

class DeviceHistory extends Model { }

DeviceHistory.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    event: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    eventTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'DeviceHistory',
    tableName: 'device_history'
});

module.exports = DeviceHistory;
