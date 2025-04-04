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

    //-------------------------ampl. & freq. variablen ----------------------------
    let max_amplitude = 0;
    let min_amplitude = 0;
    const zero_points: number[] = [];
    const frequency: number[] = [];
    const amplitude: number[] = [];
    const amplitude_each_max: number[] = [];
    const amplitude_each_min: number[] = [];

    let previousPosition = 0;
    let lastZeroIndex: number | null = null; // index used to distinguish, like a timestamp
    let middleTime = null;
    //-------------------------ampl. & freq. variablen ende ----------------------------

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

    //-------------------------ampl. & freq. rest ----------------------------
    positionBatch.forEach((dataPoint, index) => {
      const currentPosition = dataPoint.x; // Example: using X-axis for amplitude analysis
      //const currentTime = buffer[index]?.time || index; // Assuming time data exists

      // Check amplitude
      if (currentPosition > max_amplitude) {
        max_amplitude = currentPosition;
      } else if (currentPosition < min_amplitude){
        min_amplitude = currentPosition;
      }

      // Detect zero crossings
      if ((previousPosition<=0 && currentPosition>=0) || (previousPosition>=0 && currentPosition<=0)){
        let zeroIndex;
        if ((Math.abs(previousPosition)<Math.abs(currentPosition)) && lastZeroIndex !== index-1){
          zeroIndex = index-1;
        } else if ((Math.abs(previousPosition)>Math.abs(currentPosition)) && lastZeroIndex !== index) {
          zeroIndex = index;
        } else if ((Math.abs(previousPosition)==Math.abs(currentPosition)) && lastZeroIndex !== index){
          middleTime = (index-1)+(index-(index-1))/2
          zeroIndex = middleTime;
        }

        //Zeiten der Nullpunkte in zero_points liste abspeichern
        if (zeroIndex && lastZeroIndex !== zeroIndex){
          zero_points.push(zeroIndex);
          lastZeroIndex = zeroIndex;

          //frequenz berechnen beginnen, wenn wir 3 Nullpunkte haben
      if (zero_points.length<4 && zero_points.length % 3 == 0 || zero_points.length>4 && zero_points.length % 2 == 1) {
        let freq = Math.abs(zero_points[zero_points.length-1]-zero_points[zero_points.length-3]);
        frequency.push(freq);

        //Amplitude für frequenz speichern und zurücksetzen
        if (zero_points.length > 2) {
          amplitude.push(max_amplitude-min_amplitude);
          amplitude_each_max.push(max_amplitude);
          amplitude_each_min.push(min_amplitude);
          min_amplitude = 0;
          max_amplitude = 0;
        }
      }
    }}
    previousPosition = currentPosition;
    
    });

    // Letzte Amplitude speichern
    if (zero_points.length % 2 == 1) {
      amplitude.push(max_amplitude-min_amplitude);
      amplitude_each_max.push(max_amplitude);
      amplitude_each_min.push(min_amplitude);
      min_amplitude = 0;
      max_amplitude = 0;
    }

    console.log("Zero points:", zero_points);//Nullpunkte
    console.log("Frequencies:", frequency);
    console.log("Amplitude:", amplitude);

    //-------------------------ampl. & freq. rest ende ----------------------------

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


