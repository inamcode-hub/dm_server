const jwt = require('jsonwebtoken');




const sendMessageAndDestroy = (socket, message) => {
    socket.write(`HTTP/1.1 401 Unauthorized\r\nContent-Type: text/plain\r\n\r\n${message}`);
    socket.destroy();
};

const authenticateDevice = (token, socket, callback) => {
    if (!token) {
        console.log('No token provided');
        sendMessageAndDestroy(socket, 'Error: No token provided.');
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            const errorMessage = err instanceof jwt.TokenExpiredError ?
                `Token expired at: ${err.expiredAt}` :
                'Invalid token';
            console.error(errorMessage);
            sendMessageAndDestroy(socket, errorMessage);
            return;
        }
        if (!decoded.deviceId || !decoded.DeviceModel) {
            const errorMessage = 'Token missing required claims';
            console.error(errorMessage);
            sendMessageAndDestroy(socket, errorMessage);
            return;
        }

        callback(decoded);
    });
};

module.exports = authenticateDevice;