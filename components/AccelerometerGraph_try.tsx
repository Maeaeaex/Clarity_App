import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LineChart } from 'react-native-gifted-charts';

//----- Einschub
type AnalysisResult = {
  changes: number[];
  percentChanges: number[];
  trend: "Increasing" | "Decreasing" | "Stable" | "Not enough data";
};

//------

// Sampling and processing settings
const samplingRate = 125; // Hz
const dt = 1 / samplingRate;
const batchTimeWindow = 20; // seconds
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
  const currentBatchWindow = useRef<number>(batchTimeWindow); // Dynamic window
  const startTimeRef = useRef<number | null>(null);


  useEffect(() => {
    let isMounted = true;
    startTimeRef.current = Date.now(); // added

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
    if (buffer.length < samplingRate * 2) return; // Minimum 2 seconds of data


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
    const frequency: number[] = [];
    const amplitude: number[] = [];
    let maxAmplitude = 0;
    let minAmplitude = 0;
    let previousPosition = 0;
    const zeroPoints: number[] = [];

    positionBatch.forEach((dataPoint, index) => {
      const currentPosition = dataPoint.z;

      // Track min/max amplitude
      if (currentPosition > maxAmplitude) maxAmplitude = currentPosition;
      if (currentPosition < minAmplitude) minAmplitude = currentPosition;

      // Detect zero crossings (improved robustness)
      if (Math.sign(previousPosition) !== Math.sign(currentPosition)) {
        zeroPoints.push(index);

        // Calculate frequency when we have at least 2 zero crossings
        if (zeroPoints.length >= 3) {
          const fullPeriod = (zeroPoints[zeroPoints.length - 1] - zeroPoints[zeroPoints.length - 3]) * dt; // gibt abstand dazwischen in sekunden an 
          if (fullPeriod > 0) {
           frequency.push(1 / fullPeriod);
           amplitude.push(maxAmplitude - minAmplitude);
           // Reset for next cycle
           maxAmplitude = 0;
           minAmplitude = 0;
          }
        }
     }
     previousPosition = currentPosition;
    });


    // ==================== TREND ANALYSIS ====================

    const compareLastThree = (values: number[], type: 'frequency' | 'amplitude'): AnalysisResult => {
      if (values.length < 2) {
        return { changes: [], percentChanges: [], trend: "Not enough data" };
      }

      const windowSize = Math.min(4, values.length); // Dynamic window
      const windowValues = values.slice(-windowSize);
      const changes: number[] = [];
      const percentChanges: number[] = [];

      for (let i = 1; i < windowValues.length; i++) {
        const change = windowValues[i] - windowValues[i-1];
        const percentChange = (change / windowValues[i-1]) * 100;
        changes.push(change);
        percentChanges.push(percentChange);
      }


      const avgPercentChange = percentChanges.reduce((sum, change) => 
        sum + change, 0) / percentChanges.length;

      let trend: "Increasing" | "Decreasing" | "Stable" = "Stable";
      if (Math.abs(avgPercentChange) > 20) {
       trend = avgPercentChange > 0 ? "Increasing" : "Decreasing";
       // Real-time feedback
       if (type === 'frequency') {
         console.log(trend === "Increasing" ? "Breathe slower" : "Breathe faster");
       } else {
         console.log(trend === "Decreasing" ? "Breathe deeper" : "Breathe shallower");
       }
     }

     return { changes, percentChanges, trend};
   };

    // Run analysis
    const freqAnalysis = compareLastThree(frequency, 'frequency');
    const ampAnalysis = compareLastThree(amplitude, 'amplitude');

    // ==================== OUTPUT RESULTS ====================
    console.log("\n===== BREATHING ANALYSIS =====");
    console.log("Last 3 frequencies (Hz):", frequency.slice(-3).map(f => f.toFixed(2)));
    console.log("Frequency changes:", freqAnalysis.changes.map(change => Number(change).toFixed(6)));
    //console.log("Frequency percent changes:", freqAnalysis.percentChanges.map(percentChanges => Number(percentChanges).toFixed(6)));
    console.log("Frequency trend:", freqAnalysis.trend);
  
    console.log("\nLast 3 amplitudes:", amplitude.slice(-3).map(a => a.toFixed(6)));
    console.log("Amplitude changes:", ampAnalysis.changes.map(change => Number(change).toFixed(6)));
    //console.log("Amplitude percent changes:", ampAnalysis.percentChanges.map(percentChanges => Number(percentChanges).toFixed(6)));
    console.log("Amplitude trend:", ampAnalysis.trend);

    // ==================== SYSTEM ADJUSTMENTS ====================
   // Adaptive batch control
   if (frequency.length < 2) {
    currentBatchWindow.current = Math.min(32, currentBatchWindow.current * 1.2);
    dataBuffer.current = buffer.slice(-Math.floor(buffer.length / 2));
    console.log(`Adapting window to ${currentBatchWindow.current}s`);
    return;
  }

  // Reset for next batch
  dataBuffer.current = [];
  currentBatchWindow.current = batchTimeWindow;


  
}

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Last 3 frequencies (Hz):</Text>
      {/*frequency.slice(-3).map((freq, index) => (
      <View key={`freq-${index}`} style={styles.row}>
        <Text style={styles.cell}>Measurement {index + 1}: {freq.toFixed(2)}</Text>
      </View>
    ))*/}
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


