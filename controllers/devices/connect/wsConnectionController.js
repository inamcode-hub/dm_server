
const wsLogger = require('../../../lib/loggers/wsLogger');
const Device = require('../../../models/device');




const handleConnection = async (ws) => {
    const isOnline = true;
    const { deviceId, deviceModel, ipAddress, locationLatitude, locationLongitude } = ws;

    try {
        // check if the device is already in the database 
        const device = await Device.findOne({ where: { deviceId } });

        if (device) {
            // update the device status to online
            await Device.update({ isOnline, ipAddress, locationLatitude, locationLongitude }, { where: { deviceId } });
            wsLogger.info(`Device ${deviceId} is now online.`);
        }
        else {
            // create a new device in the database
            await Device.create({ deviceId, deviceModel, isOnline, ipAddress, locationLatitude, locationLongitude });
            wsLogger.info(`Device ${deviceId} is now online fresh register.`);
        }

    } catch (error) {
        console.error('Error handling connection:', error);
        wsLogger.error(`Error handling connection: ${error.message}`);

    }


};

module.exports = handleConnection;
