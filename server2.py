# server2.py
#npm install socket.io-client

# (* add in the algorithm ( import { io } from 'socket.io-client';) & (const socket = useRef(io('http://YOUR_IP_OR_NGROK:3000')).current;))

import socketio
import eventlet
import numpy as np
from calculations import process_acceleration


# Create a Socket.IO server
sio = socketio.Server(cors_allowed_origins='*', logger=True, engineio_logger=True)
app = socketio.WSGIApp(sio)

# Store active connections
active_connections = {}

@sio.event
def connect(sid, environ):
    print('Client connected:', sid)
    active_connections[sid] = {}

@sio.event
def sensorData(sid, data):
    try:
        times = np.array(data['times'])
        #x = np.array(data['x'])
        #y = np.array(data['y'])
        z = np.array(data['z'])
        sample_rate = data.get('sample_rate', 125)
        result = process_acceleration(times, z, sample_rate)
        sio.emit('calculationResult', result, room=sid)
        print(f"Processed and sent result to {sid}")
    except Exception as err:
        print('Processing error:', err)
        sio.emit('error', {'message': 'Processing error'}, room=sid)

@sio.event
def disconnect(sid):
    print('Client disconnected:', sid)
    active_connections.pop(sid, None)

if __name__ == '__main__':
    PORT = 3000
    print(f"Server running on port {PORT}")
    eventlet.wsgi.server(eventlet.listen(('', PORT)), app)


#old version for node.js
'''const express = require('express');
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
'''