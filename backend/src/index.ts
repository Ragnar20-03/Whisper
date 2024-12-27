import express from "express";
import WebSocket from "ws";
import http from "http";
import { PORT } from "./config/dotenv";
import { startMongo } from "./Schema/Schema";
import { router as userRouter } from "./routes/user";
import cors from "cors"
const app = express();
app.use(cors({
    origin: '*',  // Allow all origins, or replace with specific ones
    methods: ['GET', 'POST'],
}));
// Middleware and routes
app.use(express.json());
app.use('/user', userRouter);  // User API routes

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server using the HTTP server instance
const wss = new WebSocket.Server({ server });

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
    startMongo(); // Connect to MongoDB
    console.log(`Server started on port ${PORT}`);
});