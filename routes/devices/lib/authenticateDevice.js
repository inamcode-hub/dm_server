const jwt = require('jsonwebtoken');
const url = require('url');
const wsLogger = require('../../../lib/loggers/wsLogger');


const terminateWithError = (socket, message, ipAddress) => {
    wsLogger.error(`Error in authenticateDevice.js- Message: ${message}. IP address: ${ipAddress}`);
    socket.write(`HTTP/1.1 401 Unauthorized\r\nContent-Type: text/plain\r\n\r\n${message}`);
    socket.destroy();
};

const authenticateDevice = (req, socket, callback) => {
    const { query } = url.parse(req.url, true);
    const token = query.token;

    const ipAddress = req.connection.remoteAddress;

    if (!token) {
        terminateWithError(socket, 'No token provided.', ipAddress);
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            const errorMessage = err instanceof jwt.TokenExpiredError ?
                `Token expired at: ${err.expiredAt}` :
                'Invalid token';
            terminateWithError(socket, errorMessage, ipAddress);
            return;
        }
        if (!decoded.deviceId || !decoded.DeviceModel) {
            terminateWithError(socket, 'Invalid decoded token.', ipAddress);
            return;
        }

        callback(decoded);
    });
};

module.exports = authenticateDevice;