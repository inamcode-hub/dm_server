const jwt = require('jsonwebtoken');
const consoleLogger = require('./loggers/consoleLogger');

// This function generates a JWT and logs it to the console
function generateAndLogToken() {
    const secretKey = process.env.JWT_SECRET;  // Replace with your actual secret key
    const payload = {
        deviceId: 1080,
        DeviceModel: 'dm100',

    };

    // Generate a JWT
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    // Log the generated JWT
    console.log(`Generated JWT: ${token}`);

    return token;  // Optionally return the token if you need to use it elsewhere
}

// Call the function to generate and log the token
generateAndLogToken();
