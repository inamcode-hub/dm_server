// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const setupWebSocketRoute = require('./routes/devices/websocketRoute'); // Adjust the path as necessary
const generateAndLogToken = require('./lib/token'); // Adjust the path as necessary
const app = express();
const port = process.env.PORT || 3000;

// Initialize the HTTP server
const server = http.createServer(app);

// Middleware to parse JSON bodies
app.use(express.json());

// Define a sample route
app.get('/api/data', (req, res) => {
    res.json({ message: 'This is a sample API response!' });
});
// if no rout matches
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Set up WebSocket route
setupWebSocketRoute(server);

// Start the server
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
