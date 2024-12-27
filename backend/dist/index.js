"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = require("./config/dotenv");
const Schema_1 = require("./Schema/Schema");
const user_1 = require("./routes/user");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Use CORS middleware for HTTP API routes
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'],
}));
// Middleware and routes
app.use(express_1.default.json());
app.use('/user', user_1.router); // User API routes
// Create HTTP server
const server = http_1.default.createServer(app);
// Create WebSocket server using the HTTP server instance
const wss = new ws_1.default.Server({
    server,
    verifyClient: (info, done) => {
        // Manually allow all origins for WebSocket connections
        const origin = info.origin || '';
        if (origin === '' || origin === 'http://localhost:3000' || origin.startsWith('http://') || origin.startsWith('https://')) {
            done(true); // Allow the WebSocket connection
        }
        else {
            done(false, 403, 'Forbidden'); // Reject connection with a 403 status if origin is not allowed
        }
    }
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
    (0, Schema_1.startMongo)(); // Connect to MongoDB
    console.log(`Server started on port ${dotenv_1.PORT}`);
});
