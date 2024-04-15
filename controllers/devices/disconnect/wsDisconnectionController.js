// controllers/wsDisconnectionController.js


const wsLogger = require("../../../lib/loggers/wsLogger");

// Function to handle WebSocket disconnections
const handleDisconnection = (ws) => {
    ws.on('close', () => {
        wsLogger.info(`Device ${ws.deviceId} disconnected with IP address ${ws.ipAddress}`);
    });
};

module.exports = handleDisconnection;


