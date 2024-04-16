const cron = require('node-cron');
const { sequelize } = require('../../db/dbConnect');

// Function to create daily partitions
const createDailyPartition = async () => {
    const date = new Date();
    date.setDate(date.getDate() + 1); // Tomorrow
    const partitionName = `device_history_${date.toISOString().split('T')[0].replace(/-/g, '')}`;
    const from = `${date.toISOString().split('T')[0]} 00:00:00`;
    const to = new Date(date);
    to.setDate(to.getDate() + 1);
    const toStr = `${to.toISOString().split('T')[0]} 00:00:00`;

    const query = `
        CREATE TABLE IF NOT EXISTS ${partitionName} PARTITION OF device_history
        FOR VALUES FROM ('${from}') TO ('${toStr}');
    `;
    try {
        await sequelize.query(query);
        console.log(`Partition ${partitionName} created from ${from} to ${toStr}`);
    } catch (error) {
        console.error('Failed to create partition:', error);
    }
};

// Function to delete old entries older than 30 days
const deleteOldEntries = async () => {
    const query = "DELETE FROM device_history WHERE eventTime < NOW() - INTERVAL '30 days'";
    try {
        await sequelize.query(query);
        console.log('Old device history entries deleted successfully.');
    } catch (error) {
        console.error('Failed to delete old entries:', error);
    }
};

// Schedule tasks
cron.schedule('0 0 * * *', createDailyPartition, { scheduled: true, timezone: "Europe/London" });
cron.schedule('30 1 * * *', deleteOldEntries, { scheduled: true, timezone: "Europe/London" });

module.exports = { createDailyPartition, deleteOldEntries };
