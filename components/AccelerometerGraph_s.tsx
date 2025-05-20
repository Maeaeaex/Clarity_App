import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
// added to connect to the server ( delete if not needed)
import { io } from 'socket.io-client';


// Sampling and processing settings
const samplingRate = 125; // Hz
const dt = 1 / samplingRate;
const batchTimeWindow = 10; // seconds
const batchSize = samplingRate * batchTimeWindow;
const RECORDING_DURATION = 600; // 10 minutes in seconds


interface AccelSample {
  x: number;
  y: number;
  z: number;
  t: number;
}

interface PositionSample {
  x: number;
  y: number;
  z: number;
}


/**
 * The AccelerometerGraph component.
 */
const AccelerometerGraph: React.FC = () => {
  const [positionDataBatch, setPositionDataBatch] = useState<PositionSample[]>([]);
  const dataBuffer = useRef<AccelSample[]>([]);
  const startTimeRef = useRef<number>(Date.now());
  const allPositionData = useRef<PositionSample[]>([]); // Stores all collected data
  const subscriptionRef = useRef<ReturnType<typeof Accelerometer.addListener> | null>(null);

  const socket = useRef(io('http://192.168.0.33:3000', { transports: ['websocket'] })).current; // replace with LAN IP or use 10.0.2.2 for Android emulator
// find the IP= windows powershell ipconfig

  /*const saveDataToFile = async () => {
    try {
      if (allPositionData.current.length === 0) {
        Alert.alert("No Data", "No position data available to save");
        return;
      }

      // Create CSV content
      let csvContent = "Time(sec),X,Y,Z\n";
      allPositionData.current.forEach((sample, index) => {
        const time = (index / samplingRate).toFixed(3);
        csvContent += `${time},${sample.x},${sample.y},${sample.z}\n`;
      });

      // Create filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `position_data_${timestamp}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      // Write file
      await FileSystem.writeAsStringAsync(fileUri, csvContent);
      console.log("File saved to:", fileUri);

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Share Position Data',
          UTI: 'public.comma-separated-values-text'
        });
      } else {
        Alert.alert(
          'Save Complete',
          `Position data saved to:\n${fileUri}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error("Failed to save file:", error);
      Alert.alert(
        'Save Failed',
        'Could not save position data',
        [{ text: 'OK' }]
      );
    }
  };*/

  // Listen for processed data from server
  useEffect(() => {
    socket.on('calculationResult', (result) => {
      // === CHECK FOR EMPTY ARRAYS ===
    if (!result.position || result.position.length === 0) {
      console.log('Received empty position array from server:', result);
      Alert.alert('No processed data', 'Server returned empty position array.');
    }
    if (!result.times || result.times.length === 0) {
      console.log('Received empty times array from server:', result);
      Alert.alert('No processed data', 'Server returned empty times array.');
    }

      // result: { position, velocity, z_filtered, times }
      setPositionDataBatch(result.position.map((z: number, i: number) => ({
        z,
        t: result.times[i] || 0,
      })));
    });

    socket.on('error', (err: any) => {
      Alert.alert('Server Error', err.message);
    });
    socket.on('connect_error', (err) => {
      Alert.alert('Socket Connection Error', err.message);
    });

    return () => {
      socket.off('calculationResult');
      socket.off('error');
      socket.off('connect_error');
    };
  }, [socket]);

  // Collect and send data
  useEffect(() => {
    let isMounted = true;
    startTimeRef.current = Date.now();

    const subscription = Accelerometer.addListener((accelerometerData) => {
      if (!isMounted) return;
      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
      if (elapsedSeconds >= RECORDING_DURATION) {
        subscription.remove();
        sendBufferToServer();
        return;
      }
      dataBuffer.current.push({
        x: accelerometerData.x,
        y: accelerometerData.y,
        z: accelerometerData.z,
        t: Date.now(),
      });

      if (dataBuffer.current.length >= batchSize) {
        sendBufferToServer();
      }
    });

    Accelerometer.setUpdateInterval(1000 / samplingRate);

    function sendBufferToServer() {
      if (dataBuffer.current.length === 0) return;
      const times = dataBuffer.current.map((s) => s.t / 1000); // seconds
      const x = dataBuffer.current.map((s) => s.x);
      const y = dataBuffer.current.map((s) => s.y);
      const z = dataBuffer.current.map((s) => s.z);

      socket.emit('sensorData', {
        times,
        x,
        y,
        z,
        sample_rate: samplingRate,
      });
      dataBuffer.current = [];
    }

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  

  return (
    <View style={styles.container}>
        <Text>Recording position data...</Text>
        <Text>Duration: {RECORDING_DURATION / 60} minutes</Text>
         <Text></Text>
         <Text>Recording and sending accelerometer data to server...</Text>
        <Text style={{ color: 'white' }}>Received {positionDataBatch.length} processed position samples</Text>
       <View style={styles.buttonContainer}>
         <Pressable style={[styles.button, { backgroundColor: "#121212" }]} //onPress={saveDataToFile}
         >
           <Text style={styles.buttonLabel}>Save data</Text>
         </Pressable>
       </View>
       </View>
  );
};

export default AccelerometerGraph;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    padding: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  cell: {
    fontSize: 14,
  },
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: "#121212"
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});

