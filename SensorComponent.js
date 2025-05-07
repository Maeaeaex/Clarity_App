// SensorComponent.js ( can be adjusted according to the code that is available)
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import io from 'socket.io-client';
import { Buffer } from 'buffer';

// Configuration
const SERVER_URL = 'http://your-server-ip:3000'; // Change to IP adress bc Node.js 
const SENSOR_UPDATE_INTERVAL = 100; // how fast data is sampled ( miliseconds), can be adjusted
const BATCH_SIZE = 10; // Send data in small batches, can be adjusted evtl increase it

const SensorComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  
  // References ( store websocket & sensor) ( adjust according to the code available)
  const socketRef = useRef(null);
  const sensorDataBufferRef = useRef([]);
  const accelerometerSubscriptionRef = useRef(null);
  const gyroscopeSubscriptionRef = useRef(null);
  
  // Set up socket connection
  useEffect(() => {
    // Initialize socket
    socketRef.current = io(SERVER_URL);
    
    // Set up event listeners ( look for event)
    socketRef.current.on('connect', () => {
      setConnectionStatus('Connected');
      console.log('Connected to server');
    });
    
    socketRef.current.on('disconnect', () => {
      setConnectionStatus('Disconnected');
      console.log('Disconnected from server');
    });
    
    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
      Alert.alert('Connection Error', 'Failed to communicate with the server');
    });
    
    socketRef.current.on('feedback', (data) => {
      setFeedback(data);
    });
    
    // Clean up on unmount when stopping the recording
    return () => {
      cleanupSensors();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);
  
  // Configure sensor update interval
  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, SENSOR_UPDATE_INTERVAL);
    setUpdateIntervalForType(SensorTypes.gyroscope, SENSOR_UPDATE_INTERVAL);
  }, []);

  //############################################ Add code from the sensor read out ###################################################
  
  // Start recording from sensors
  const startRecording = () => {
    if (socketRef.current && !socketRef.current.connected) {
      Alert.alert('Not Connected', 'Please wait for server connection');
      return;
    }
    
    setIsRecording(true);
    sensorDataBufferRef.current = [];
    
    // Subscribe to accelerometer
    accelerometerSubscriptionRef.current = accelerometer.subscribe(({ x, y, z }) => {
      const timestamp = Date.now();
      const accelerometerData = { type: 'accelerometer', timestamp, x, y, z };
      processSensorData(accelerometerData);
    });
    
    // Subscribe to gyroscope
    gyroscopeSubscriptionRef.current = gyroscope.subscribe(({ x, y, z }) => {
      const timestamp = Date.now();
      const gyroscopeData = { type: 'gyroscope', timestamp, x, y, z };
      processSensorData(gyroscopeData);
    });
    
    console.log('Started recording sensor data');
  };
  
  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
    cleanupSensors();
    console.log('Stopped recording sensor data');
  };
  // ################################## end of code to add #####################################################
  // Process incoming sensor data
  const processSensorData = (data) => {
    sensorDataBufferRef.current.push(data);
    
    // When we reach batch size, send the data to the server
    if (sensorDataBufferRef.current.length >= BATCH_SIZE) {
      sendSensorDataBatch();
    }
  };
  
  // Send batched sensor data to server
  const sendSensorDataBatch = () => {
    if (socketRef.current && socketRef.current.connected && sensorDataBufferRef.current.length > 0) {
      socketRef.current.emit('sensorData', sensorDataBufferRef.current);
      sensorDataBufferRef.current = []; // Clear the buffer after sending
    }
  };
  
  // Cleanup sensor subscriptions for when stopping the recording
  const cleanupSensors = () => {
    if (accelerometerSubscriptionRef.current) {
      accelerometerSubscriptionRef.current.unsubscribe();
      accelerometerSubscriptionRef.current = null;
    }
    
    if (gyroscopeSubscriptionRef.current) {
      gyroscopeSubscriptionRef.current.unsubscribe();
      gyroscopeSubscriptionRef.current = null;
    }
    
    // Send any remaining data (data collected but not sent yet)
    if (sensorDataBufferRef.current.length > 0) {
      sendSensorDataBatch();
    }
  };
  
  // ################################### add feedback code###########################################################
  const formatFeedback = (feedback) => {
    if (!feedback) return 'No feedback yet';
    
    return
});

export default SensorComponent;