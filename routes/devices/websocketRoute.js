const WebSocket = require('ws');
const handleConnection = require('../../controllers/devices/connect/wsConnectionController');
const handleDisconnection = require('../../controllers/devices/disconnect/wsDisconnectionController');
const authenticateDevice = require('./lib/authenticateDevice');
const setupHeartbeat = require('./lib/setupHeartbeat');
const wsLogger = require('../../lib/loggers/wsLogger');

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



                wss.emit('connection', ws, req);
                ws.on('pong', () => {

                    wsLogger.info(`Received pong from ${ws.deviceId}`);
                    ws.isAlive = true; // Set isAlive to true when a pong message is received
                });


                handleConnection(ws, req);
                ws.on('message', (message) => {
                    console.log(`Received message => ${message}`);
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

module.exports = setupWebSocketRoute;