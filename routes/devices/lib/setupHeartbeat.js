



const setupHeartbeat = (wss) => {
    setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false; // Set isAlive to false and wait for a pong message
            ws.ping(); // Send a ping frame
        });
    }, 3000); // Check every 30 seconds
};


module.exports = setupHeartbeat;