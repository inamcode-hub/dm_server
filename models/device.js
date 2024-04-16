// models/device.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/dbConnect');

class Device extends Model { }

Device.init({
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    deviceModel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isOnline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lastOnline: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Active'
    },
    firmwareVersion: {
        type: DataTypes.STRING

    },
    ipAddress: {
        type: DataTypes.STRING
    },
    locationLatitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    locationLongitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },

}, {
    sequelize,
    modelName: 'Device',
    tableName: 'devices'
});

module.exports = Device;
