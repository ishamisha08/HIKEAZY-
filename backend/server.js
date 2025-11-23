import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import cookieParser from 'cookie-parser';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import trailRouter from './routes/trailRoute.js';
import userRouter from './routes/userRoute.js';
import hikerRouter from './routes/hikerRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import http from 'http';

// Import socket.io as an ES module
import { Server } from 'socket.io';
import chatRouter from './routes/chatRoute.js';

// app config
const app = express();
const server = http.createServer(app); // Wrap express app in http server for socket.io
// Initialize socket.io with CORS configuration
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Allowed origins
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials
  },
});

const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']; // Remove the trailing slash

// middlewares
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// api endpoints
app.use('/api/admin', adminRouter);
app.use('/api/trail', trailRouter);
app.use('/api/user', userRouter);
app.use('/api/hiker', hikerRouter);
app.use('/api/review', reviewRouter);
app.use('/api/chat',chatRouter)


  app.get('/', (req, res) => {
    res.send('API WORKING');
  });

  
// Socket.IO Events
let users = [];

const addUser = (userId, socketId) => {
    if (!users.some(user => user.userId === userId)) {
      users.push({ userId, socketId });
      console.log(`User added: ${userId} with socketId: ${socketId}`);
    } else {
      console.log(`User already exists: ${userId}`);
    }
    console.log('Current users:', users);
  };
  
  

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
  console.log(`User with socketId ${socketId} removed. Current users:`, users);
};

const getUser = (userId) => {
  return users.find(user => user.userId === userId);
};

// Listen for client connections
io.on('connection', (socket) => {
  console.log('a user connected');

  // Add user to the list when they connect
  socket.on('addUser', (userId) => {
    if (!userId) {
      console.error('UserId is undefined during addUser.');
      return;
    }
    console.log(`Adding user: ${userId} with socketId: ${socket.id}`);
    addUser(userId, socket.id);
    io.emit('getUsers', users); // Emit the updated users list to all clients
  });

  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    console.log('Message details:', { senderId, receiverId, text });
    const receiver = getUser(receiverId);
    if (receiver) {
      console.log(`Sending message from ${senderId} to ${receiverId}`);
      io.to(receiver.socketId).emit('getMessage', { senderId, text });
    } else {
      console.error(`Error: Receiver ${receiverId} not connected.`);
      io.to(socket.id).emit('messageError', `Receiver ${receiverId} is offline or not connected.`);
    }
  });
  
  
  // Remove user from the list when they disconnect
  socket.on('disconnect', () => {
    console.log(`User with socketId ${socket.id} disconnected`);
    removeUser(socket.id);
    io.emit('getUsers', users); // Emit updated user list
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Start the server
server.listen(port, () => console.log(`Server started on port ${port}`));

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log("Shutting down...");
  io.close(() => {
    console.log("Socket.IO server closed.");
    server.close(() => {
      console.log("HTTP server closed.");
    });
  });
});

// Export io and getUser
export { io, getUser }