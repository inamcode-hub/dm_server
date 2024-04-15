



const setupHeartbeat = (wss) => {
    setInterval(() => {
        wss.clients.forEach((ws) => {
            if (!ws.retryCount) ws.retryCount = 0;

            if (ws.isAlive === false) {
                ws.retryCount++;
                if (ws.retryCount > 3)
                    wsLogger.info(`Device ${ws.deviceId} disconnected with IP address ${ws.ipAddress}`);
                return ws.terminate(); // Allow 3 missed pings before termination
            } else {
                ws.retryCount = 0; // Reset retry count on a successful pong
            }

            ws.isAlive = false; // Expect a pong response
            ws.ping(); // Send a ping frame
        });
    }, 3000); // Adjusted to check every 30 seconds
};


module.exports = setupHeartbeat;