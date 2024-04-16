const jwt = require('jsonwebtoken');
const consoleLogger = require('./loggers/consoleLogger');

// This function generates a JWT and logs it to the console
function generateAndLogToken() {
    const deviceModels = ['dm100', 'dm200', 'dm300', 'dm400'];
    const firmwareVersions = ['v1.0', 'v1.1', 'v1.2', 'v2.0'];


    const secretKey = process.env.JWT_SECRET;  // Replace with your actual secret key
    const payload = {
        deviceId: `ID-${Math.floor(Math.random() * 10000)}`, // Generates a random device ID
        deviceModel: deviceModels[Math.floor(Math.random() * deviceModels.length)], // Randomly selects a model from the list
        firmwareVersion: firmwareVersions[Math.floor(Math.random() * firmwareVersions.length)], // Randomly picks a firmware version
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, // Generates a random IP address within a common private range
        locationLatitude: (Math.random() * 180 - 90).toFixed(6), // Generates a random latitude
        locationLongitude: (Math.random() * 360 - 180).toFixed(6) // Generates a random longitude


    };

    // Generate a JWT
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    // Log the generated JWT
    console.log(`Generated JWT: ${token}`);

    return token;  // Optionally return the token if you need to use it elsewhere
}

// Call the function to generate and log the token
generateAndLogToken();
