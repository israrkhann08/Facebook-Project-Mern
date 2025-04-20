const express = require('express');
const http = require('http'); // Required for Socket.io
const { Server } = require('socket.io'); // Importing Socket.io
const app = express();
const port = 4000;
const connectDB = require('./config/db.js');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute.js');
const cors = require('cors');
const path = require('path');

// Connect to MongoDB
connectDB();

// Middleware parser
app.use(express.json());
app.use(cors());

// Routes
app.use('/user', userRoute);
app.use('/user/post', postRoute);

// Serve Static Files (For Uploaded Images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: '*', // Allow any origin for simplicity
        methods: ["GET", "POST"],
    },
});

// Make Socket.io instance available in routes
app.set('io', io);

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

