// server.js
// write in terminal:
// npm init -y ( required dependencies)
// npm install express socket.io (required dependencies)
// node server.js ( to run the server)
// stop server= Ctrl C
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Store active connections
const activeConnections = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // create storage space for the users data, data is temporarily stored 
  activeConnections.set(socket.id, {
    latestData: null,
    analysisResults: null
  });

  // Handle incoming sensor data
  socket.on('sensorData', (data) => {
    const clientData = activeConnections.get(socket.id);
    if (!clientData) return;
    
    // Store the latest data
    clientData.latestData = data;
    
    try {
      // Process the data in real-time, connects to the algorithm 
      const analysisResults = analyzeData(data);
      
      // Store the analysis results
      clientData.analysisResults = analysisResults;
      
      // Send feedback to the user
      socket.emit('feedback', analysisResults);
      
      // Log for debugging only for the development (can be deleted in the final app )
      console.log(`Processed data for ${socket.id}:`, {
        dataSnapshot: data.slice(0, 2), // Just log a sample
        resultsSnapshot: analysisResults
      });
    } catch (error) {
      console.error('Error analyzing data:', error);
      socket.emit('error', { message: 'Error processing sensor data' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    activeConnections.delete(socket.id);
  });
});


function analyzeData(sensorData) {
  // -------------------------------------------------add the algorithm here for analysing sensor data--------------------------------
  return {
    
    processed: true,
    timestamp: Date.now(),
    metrics: {
      value1: calculateAverage(sensorData),
      value2: calculatePeak(sensorData)
    },
    feedback: determineFeedback(sensorData)
  };
}
 

function calculateAverage(data) {
// ----------------------------add code for the frequency & ampltitude ---------------------------------------------
}

function calculatePeak(data) {
  // ---------------------------------- add code to calculate the peaks---------------------------------------
}

function determineFeedback(data) {
  // ----------------------------------- add code to compare the frequency & amplitude & when to give feedback----------------------------
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});