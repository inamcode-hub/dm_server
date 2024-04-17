// controllers/wsDisconnectionController.js
const Device = require('../../../models/device');


const wsLogger = require("../../../lib/loggers/wsLogger");

// Function to handle WebSocket disconnections
const handleDisconnection = (ws) => {
    ws.on('close', async () => {

        // Set connection flags
        ws.isAuthenticated = false;
        ws.isAlive = false;
        ws.deviceId = null;
        ws.deviceModel = null;
        ws.ipAddress = null;
        ws.locationLatitude = null;
        ws.locationLongitude = null;
        ws.firmwareVersion = null;

        try {
            // Update the device status to offline
            await Device.update({ isOnline: false }, { where: { deviceId: ws.deviceId } });
            wsLogger.info(`Device ${ws.deviceId} is now offline.`);
        } catch (error) {
            console.error('Error handling disconnection:', error);
            wsLogger.error(`Error handling disconnection: ${error.message}`);
        }
    });
};

module.exports = handleDisconnection;


