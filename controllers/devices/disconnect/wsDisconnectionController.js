// controllers/wsDisconnectionController.js

// Function to handle WebSocket disconnections
const handleDisconnection = (ws) => {
    ws.on('close', () => {
        if (ws.id) {
            console.log(`Connection with ID ${ws.id} closed and removed from active connections.`);
        }
    });
};

module.exports = handleDisconnection;


