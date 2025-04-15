import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity,Pressable, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Sampling and processing settings
const samplingRate = 125; // Hz
const dt = 1 / samplingRate;
const batchTimeWindow = 10; // seconds
const batchSize = samplingRate * batchTimeWindow;
const RECORDING_DURATION = 600; // 10 minutes in seconds, here time limit of recording

// Low-pass filter coefficients (example)
const lp_b: number[] = [0.0675, 0.1349, 0.0675];
const lp_a: number[] = [1.0, -1.1430, 0.4128];

// High-pass filter coefficients (example)
const hp_b: number[] = [0.8008, -1.6016, 0.8008];
const hp_a: number[] = [1.0, -1.5610, 0.6414];

interface AccelSample {
  x: number;
  y: number;
  z: number;
}

interface PositionSample {
  x: number;
  y: number;
  z: number;
}

/**
 * Applies an IIR filter to a batch of samples.
 */
const applyIIRFilterBatch = (samples: number[], b: number[], a: number[]): number[] => {
  const N = samples.length;
  const filteredOutput: number[] = new Array(N).fill(0);

  let xHist: number[] = [0, 0];
  let yHist: number[] = [0, 0];

  for (let n = 0; n < N; n++) {
    const currentSample: number = samples[n];

    const filteredSample: number =
      b[0] * currentSample +
      b[1] * xHist[0] +
      b[2] * xHist[1] -
      a[1] * yHist[0] -
      a[2] * yHist[1];

    filteredOutput[n] = filteredSample;

    xHist[1] = xHist[0];
    xHist[0] = currentSample;

    yHist[1] = yHist[0];
    yHist[0] = filteredSample;
  }

  return filteredOutput;
};

/**
 * Subtracts the mean (bias) from an array of data.
 */
const correctBias = (dataArray: number[]): number[] => {
  const sum = dataArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const mean = sum / dataArray.length;

  return dataArray.map((value) => value - mean);
};

/**
 * Performs double numerical integration on acceleration data to calculate position.
 */
const doubleIntegrateWithMeanCorrection = (accelArray: number[]): number[] => {
  const N = accelArray.length;
  let velocityArray: number[] = new Array(N).fill(0);
  let positionArray: number[] = new Array(N).fill(0);

  // First integration: acceleration -> velocity
  for (let i = 1; i < N; i++) {
    velocityArray[i] =
      velocityArray[i - 1] +
      ((accelArray[i] + accelArray[i - 1]) / 2) * dt;
  }

  velocityArray = correctBias(velocityArray);

  // Second integration: velocity -> position
  for (let i = 1; i < N; i++) {
    positionArray[i] =
      positionArray[i - 1] +
      ((velocityArray[i] + velocityArray[i - 1]) / 2) * dt;
  }

  positionArray = correctBias(positionArray);

  return positionArray;
};

/**
 * The AccelerometerGraph component.
 */
const AccelerometerGraph: React.FC = () => {
  const [positionDataBatch, setPositionDataBatch] = useState<PositionSample[]>([]);
  const dataBuffer = useRef<AccelSample[]>([]);
  const startTimeRef = useRef<number>(Date.now());
  const allPositionData = useRef<PositionSample[]>([]); // Stores all collected data
  const subscriptionRef = useRef<ReturnType<typeof Accelerometer.addListener> | null>(null);

  const saveDataToFile = async () => {
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
  };

  const processBuffer = () => {
    const buffer = [...dataBuffer.current];
    dataBuffer.current = [];

    if (buffer.length === 0) return;

    const xSamples: number[] = buffer.map((sample) => sample.x);
    const ySamples: number[] = buffer.map((sample) => sample.y);
    const zSamples: number[] = buffer.map((sample) => sample.z);

    const lpFilteredX: number[] = applyIIRFilterBatch(xSamples, lp_b, lp_a);
    const lpFilteredY: number[] = applyIIRFilterBatch(ySamples, lp_b, lp_a);
    const lpFilteredZ: number[] = applyIIRFilterBatch(zSamples, lp_b, lp_a);

    const hpFilteredX: number[] = applyIIRFilterBatch(lpFilteredX, hp_b, hp_a);
    const hpFilteredY: number[] = applyIIRFilterBatch(lpFilteredY, hp_b, hp_a);
    const hpFilteredZ: number[] = applyIIRFilterBatch(lpFilteredZ, hp_b, hp_a);

    const correctedX: number[] = correctBias(hpFilteredX);
    const correctedY: number[] = correctBias(hpFilteredY);
    const correctedZ: number[] = correctBias(hpFilteredZ);

    const positionX: number[] = doubleIntegrateWithMeanCorrection(correctedX);
    const positionY: number[] = doubleIntegrateWithMeanCorrection(correctedY);
    const positionZ: number[] = doubleIntegrateWithMeanCorrection(correctedZ);

    const positionBatch: PositionSample[] = positionX.map((_, index) => ({
      x: positionX[index],
      y: positionY[index],
      z: positionZ[index],
    }));

    allPositionData.current = [...allPositionData.current, ...positionBatch];
    setPositionDataBatch(positionBatch);

  };


  useEffect(() => {
    let isMounted = true;
    startTimeRef.current = Date.now();


      const subscription = Accelerometer.addListener((accelerometerData: AccelSample) => {
        if (!isMounted) return;

        // Check recording duration
      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
      if (elapsedSeconds >= RECORDING_DURATION) {
        subscriptionRef.current?.remove();
        processBuffer(); // Process any remaining data
        saveDataToFile(); // Save all collected data
        return;
      }

        dataBuffer.current.push(accelerometerData);

        if (dataBuffer.current.length >= batchSize) {
          processBuffer();
        }
      });

      subscriptionRef.current = subscription;
    Accelerometer.setUpdateInterval(1000 / samplingRate);

    return () => {
      isMounted = false;
      subscriptionRef.current?.remove();
    };
  }, []);


  

  return (
    <View style={styles.container}>
      <Text>Recording position data...</Text>
      <Text>Duration: {RECORDING_DURATION / 60} minutes</Text>
      <Text></Text>
    <View style={styles.buttonContainer}>
      <Pressable style={[styles.button, { backgroundColor: "#121212" }]} onPress={saveDataToFile}>
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

