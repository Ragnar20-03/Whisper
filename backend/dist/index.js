"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("./config/dotenv"); // Make sure you have your .env set up for port
const Schema_1 = require("./Schema/Schema");
const app = (0, express_1.default)();
// Middleware to allow any origin (CORS for HTTP routes, WebSocket is handled separately)
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins (for HTTP routes)
    methods: ['GET', 'POST'],
}));
app.get('/me', (req, res) => {
    res.status(200).json({
        msg: "jay Ganesh !"
    });
});
// Create HTTP server
const server = http_1.default.createServer(app);
// Create WebSocket server using the HTTP server instance
const wss = new ws_1.default.Server({
    server,
    verifyClient: (info, done) => {
        // You can check the `Origin` header here to control who connects.
        // For now, we allow anyone to connect.
        done(true); // Allow connection
    },
});
// Store chat messages (could be replaced with a database)
const chatMessages = [];
let userConnected = 0;
wss.on('connection', (ws) => {
    userConnected++;
    console.log("User connected!", userConnected);
    // Send the stored messages to the new client
    ws.send(JSON.stringify({ type: 'init', messages: chatMessages }));
    // Track the user's username (initialized as null)
    let username = null;
    // Listen for messages from the client
    ws.on('message', (message) => {
        // Parse incoming message to JSON
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message.toString());
        }
        catch (e) {
            console.error('Failed to parse message:', e);
            return;
        }
        // Check the message type and handle accordingly
        if (parsedMessage.type === 'setUsername') {
            // Set the username when the client sends it
            username = parsedMessage.username;
            console.log(`Username set to: ${username}`);
        }
        else if (parsedMessage.type === 'newMessage' && username) {
            // Handle new chat messages
            const newMessage = { sender: username, message: parsedMessage.message };
            chatMessages.push(newMessage);
            // Broadcast the new message to all other connected clients
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify({ type: 'newMessage', message: newMessage }));
                }
            });
        }
        else {
            console.error('Invalid message or username not set.');
        }
    });
    // Listen for client disconnect
    ws.on('close', () => {
        userConnected--;
        console.log('User disconnected!', userConnected);
    });
});
// Start the server
server.listen(dotenv_1.PORT, () => {
    (0, Schema_1.startMongo)();
    console.log(`Server started on port ${dotenv_1.PORT}`);
});
