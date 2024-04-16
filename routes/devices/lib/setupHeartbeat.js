const wsLogger = require("../../../lib/loggers/wsLogger");
const Device = require("../../../models/device");

const setupHeartbeat = (wss) => {
    const interval = setInterval(() => {
        wss.clients.forEach(async (ws) => {
            if (!ws.retryCount) ws.retryCount = 0;
            if (!ws.pingFailures) ws.pingFailures = 0;  // Track consecutive ping failures

            if (!ws.isAlive) {
                ws.retryCount++;
                if (ws.retryCount > 3) {
                    wsLogger.info(`Terminating connection for device ${ws.deviceId} after 3 missed pings.`);
                    terminateConnection(ws);
                }
            } else {
                ws.retryCount = 0;  // Reset retry count on a successful pong
                ws.pingFailures = 0;  // Reset ping failure count on a successful pong
            }

            ws.isAlive = false;  // Expect a pong response
            ws.ping(err => {
                if (err) {
                    ws.pingFailures++;
                    wsLogger.error(`Ping error for device ${ws.deviceId}: ${err}`);
                    if (ws.pingFailures > 1) {  // Allow one ping failure before termination
                        wsLogger.info(`Terminating connection after consecutive ping failures for device ${ws.deviceId}.`);
                        terminateConnection(ws);
                    }
                }
            });
        });
    }, 3000);  // Interval set to 3 seconds for testing, adjust as necessary

    wss.on('close', () => {
        clearInterval(interval);
    });
};

function terminateConnection(ws) {
    try {
        Device.update({ isOnline: false }, { where: { deviceId: ws.deviceId } })
            .then(() => wsLogger.info(`Device status updated to offline for ${ws.deviceId}`))
            .catch(error => wsLogger.error(`Error updating device status for ${ws.deviceId}:`, error));
    } finally {
        ws.terminate();
    }
}

module.exports = setupHeartbeat;
