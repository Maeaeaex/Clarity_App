import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';

// Sampling and processing settings
const samplingRate = 125; // Hz
const dt = 1 / samplingRate;
const batchTimeWindow = 10; // seconds
const batchSize = samplingRate * batchTimeWindow;

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

  useEffect(() => {
    let isMounted = true;

    const subscribe = () => {
      Accelerometer.setUpdateInterval(1000 / samplingRate);

      const subscription = Accelerometer.addListener((accelerometerData: AccelSample) => {
        if (!isMounted) return;

        dataBuffer.current.push(accelerometerData);

        if (dataBuffer.current.length >= batchSize) {
          processBuffer();
        }
      });

      return subscription;
    };

    const subscription = subscribe();

    return () => {
      isMounted = false;
      subscription && subscription.remove();
    };
  }, []);

  const processBuffer = () => {
    const buffer = dataBuffer.current;

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

    setPositionDataBatch(positionBatch);

    dataBuffer.current = [];
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Position Data (X, Y, Z)</Text>
      {positionDataBatch.map((dataPoint, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>X: {dataPoint.x.toFixed(4)}</Text>
          <Text style={styles.cell}>Y: {dataPoint.y.toFixed(4)}</Text>
          <Text style={styles.cell}>Z: {dataPoint.z.toFixed(4)}</Text>
        </View>
      ))}
    </ScrollView>
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
});


