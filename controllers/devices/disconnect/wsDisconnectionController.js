// controllers/wsDisconnectionController.js
const Device = require('../../../models/device');


const wsLogger = require("../../../lib/loggers/wsLogger");

// Function to handle WebSocket disconnections
const handleDisconnection = (ws) => {
    ws.on('close', async () => {
        wsLogger.info(`Device ${ws.deviceId} disconnected with IP address ${ws.ipAddress}`);
        // Set connection flags
        ws.isAuthenticated = false;
        ws.isAlive = false;

        try {
            // Update the device status to offline
            await Device.update({ isOnline: false }, { where: { deviceId: ws.deviceId } });
        } catch (error) {
            console.error('Error handling disconnection:', error);
        }
    });
};

module.exports = handleDisconnection;


