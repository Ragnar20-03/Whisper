import express, { Request, Response } from "express";
import WebSocket from "ws";
import http from "http";
import cors from "cors";
import { HOST, PORT } from "./config/dotenv";  // Make sure you have your .env set up for port
import { startMongo } from "./Schema/Schema";

const app = express();

// Middleware to allow any origin (CORS for HTTP routes, WebSocket is handled separately)
app.use(cors({
    origin: '*',  // Allow all origins (for HTTP routes)
    methods: ['GET', 'POST'],
}));

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.get('/me', (req, res) => {
    console.log('Handling /me route');
    res.status(200).json({ msg: 'jay Ganesh !' });
});

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server using the HTTP server instance
const wss = new WebSocket.Server({
    server,
    verifyClient: (info, done) => {
        // You can check the `Origin` header here to control who connects.
        // For now, we allow anyone to connect.
        done(true);  // Allow connection
    },
});

// Store chat messages (could be replaced with a database)
const chatMessages: { sender: string, message: string }[] = [];
let userConnected = 0;

wss.on('connection', (ws) => {
    userConnected++;
    console.log("User connected!", userConnected);

    // Send the stored messages to the new client
    ws.send(JSON.stringify({ type: 'init', messages: chatMessages }));

    // Track the user's username (initialized as null)
    let username: string | null = null;

    // Listen for messages from the client
    ws.on('message', (message) => {
        // Parse incoming message to JSON
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message.toString());
        } catch (e) {
            console.error('Failed to parse message:', e);
            return;
        }

        // Check the message type and handle accordingly
        if (parsedMessage.type === 'setUsername') {
            // Set the username when the client sends it
            username = parsedMessage.username;
            console.log(`Username set to: ${username}`);
        } else if (parsedMessage.type === 'newMessage' && username) {
            // Handle new chat messages
            const newMessage = { sender: username, message: parsedMessage.message };
            chatMessages.push(newMessage);

            // Broadcast the new message to all other connected clients
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'newMessage', message: newMessage }));
                }
            });
        } else {
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



server.listen(PORT, () => {
    startMongo()
    console.log(`Server started on port ${PORT}`);

})