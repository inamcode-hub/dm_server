const WebSocket = require('ws');
const url = require('url');
const handleConnection = require('../../controllers/devices/connect/wsConnectionController');
const handleDisconnection = require('../../controllers/devices/disconnect/wsDisconnectionController');
const authenticateDevice = require('./lib/authenticateDevice');
const setupHeartbeat = require('./lib/setupHeartbeat');

const setupWebSocketRoute = (server) => {
    const wss = new WebSocket.Server({
        noServer: true,
    });

    server.on('upgrade', (req, socket, head) => {
        const { query } = url.parse(req.url, true);
        const token = query.token;

        authenticateDevice(token, socket, (decoded) => {
            const { deviceId, deviceModel } = decoded;


            wss.handleUpgrade(req, socket, head, (ws) => {
                ws.isAuthenticated = true;
                ws.isAlive = true;
                ws.deviceId = deviceId;
                ws.deviceModel = deviceModel;

                wss.emit('connection', ws, req);
                ws.on('pong', () => {
                    console.log('Received pong from client');
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