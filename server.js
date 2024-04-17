// server.js

// packages required
require('dotenv').config();
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const path = require('path');

// files required
const sequelize = require('./db/dbConnect');
require('./models/device');
require('./lib/loggers/consoleLogger');
require('./lib/token');
require('./lib/tasks/historyPartition')
const { setupWebSocketRoute } = require('./routes/devices/websocketRoute');

const morganLogger = require('./lib/loggers/morganLogger');
const app = express();
const port = process.env.PORT || 3000;

// Initialize the HTTP server
const server = http.createServer(app);

// Middleware to parse JSON bodies
app.use(express.json());


app.use(morgan('combined', {
    stream: {
        write: message => morganLogger.info(message.trim())
    }
}));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define a sample route
app.get('/api/data', (req, res) => {
    res.json({ message: 'This is a sample API response!' });
});

// Route to handle client-side routing, must be defined after your API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// if no rout matches
app.use((req, res) => {
    console.log('Catch-all route called');
    res.status(404).json({ message: 'Route not found' });
});


// Start the server 

sequelize.sync().then(() => {
    server.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
});


// Set up WebSocket route
setupWebSocketRoute(server);

