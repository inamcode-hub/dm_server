const WebSocket = require('ws');
const handleConnection = require('../../controllers/devices/connect/wsConnectionController');
const handleDisconnection = require('../../controllers/devices/disconnect/wsDisconnectionController');
const authenticateDevice = require('./lib/authenticateDevice');
const setupHeartbeat = require('./lib/setupHeartbeat');
const wsLogger = require('../../lib/loggers/wsLogger');

const deviceConnections = new Map();

const setupWebSocketRoute = (server) => {
    const wss = new WebSocket.Server({
        noServer: true,
    });
    server.on('upgrade', (req, socket, head) => {
        const ipAddress = req.connection.remoteAddress;
        wsLogger.info(`Upgrade request from ${ipAddress}`);

        authenticateDevice(req, socket, (decoded) => {
            const { deviceId, deviceModel, locationLatitude, locationLongitude, firmwareVersion } = decoded;


            wss.handleUpgrade(req, socket, head, (ws) => {
                ws.isAuthenticated = true;
                ws.isAlive = true;
                ws.deviceId = deviceId;
                ws.deviceModel = deviceModel;
                ws.ipAddress = ipAddress;
                ws.locationLatitude = locationLatitude;
                ws.locationLongitude = locationLongitude;
                ws.firmwareVersion = firmwareVersion
                deviceConnections.set(deviceId, ws);


                wss.emit('connection', ws, req);
                ws.on('pong', () => {

                    // wsLogger.info(`Received pong from ${ws.deviceId}`);
                    ws.isAlive = true; // Set isAlive to true when a pong message is received
                });


                handleConnection(ws);
                ws.on('message', (message) => {
                    console.log(`Received message => ${message}`);
                    // who is sending the message
                    const sender = deviceConnections.get(ws.deviceId);
                    console.log(sender)
                    if (sender !== ws) {
                        console.error('Unauthorized message sender');
                        return;
                    }
                    console.log(`Received message from device ${ws.deviceId}: ${message}`);
                });

                handleDisconnection(ws);
            });
        });
    });

    setupHeartbeat(wss);

    wss.on('error', (error) => {
        console.error('WebSocket server encountered an error:', error);
    });
};
function sendMessageToDevice(deviceId, message) {
    const ws = deviceConnections.get(deviceId);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
    } else {
        console.error(`No active connection for device ${deviceId}`);
    }
}
function sendMessageToAllDevices(message) {
    deviceConnections.forEach((ws, deviceId) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
            console.log(`Message sent to device ${deviceId}`);
        } else {
            console.error(`Connection not open for device ${deviceId}`);
        }
    });
}

module.exports = {
    setupWebSocketRoute,
    sendMessageToDevice,
    sendMessageToAllDevices,
};
