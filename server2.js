// server2.js
//npm install socket.io-client

// (* add in the algorithm ( import { io } from 'socket.io-client';) & (const socket = useRef(io('http://YOUR_IP_OR_NGROK:3000')).current;))


const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const activeConnections = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  activeConnections.set(socket.id, {});

  socket.on('sensorData', (data) => {
    try {
      // Simple example: check if displacementZ > threshold
      const eventTriggered = data.metrics?.displacementZ > 0.5;

      if (eventTriggered) {
        socket.emit('eventDetected', { type: 'Movement Detected' });
        console.log(`Event sent to ${socket.id}`, data.metrics);
      }
    } catch (err) {
      console.error('Processing error:', err);
      socket.emit('error', { message: 'Processing error' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    activeConnections.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
