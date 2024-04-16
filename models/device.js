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
    connectionType: {
        type: DataTypes.STRING
    },
    dataUsage: {
        type: DataTypes.INTEGER,
        defaultValue: 0 // Assuming data usage is measured in megabytes or a similar unit
    },
    errorCode: {
        type: DataTypes.TEXT
    }
}, {
    sequelize,
    modelName: 'Device',
    tableName: 'devices'
});

module.exports = Device;
