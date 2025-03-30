import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

export default function PositionAlgorithm() {
  //variablen
  previousPosition = 0;
  previousTime = 0;
  position_output = [];
  let zero_points = [];
  let frequency = [];
  let amplitude = [];
  let amplitude_each_max = [];
  let amplitude_each_min = [];
  let lastZeroTime = null;//damit der gleiche nullpunkt nicht zweimal gespeichert wird
  let middleTime = null;


  let max_amplitude = 0;
  let min_amplitude = 0;
  //maximum und minimum der Amplitude rausfinden
  function checkAmplitude(aktuelleAmplitude) {
    if (aktuelleAmplitude > max_amplitude) {
      max_amplitude = aktuelleAmplitude;
    } else if (aktuelleAmplitude < min_amplitude){
      min_amplitude = aktuelleAmplitude;
    }
  }

  //Funktion: Amplitude auf 0 setzen nach jeder Periode
  function resetAmplitude() {
    amplitude.push(max_amplitude-min_amplitude);
    amplitude_each_max.push(max_amplitude);
    amplitude_each_min.push(min_amplitude);
    min_amplitude = 0;
    max_amplitude = 0; 
  }

//künstliche Daten fürs Ausprobieren, Zeitabstände sind je 6 sekunden.
  const data = [
    {time: 6, position: 1},
    {time: 12, position: 2},
    {time: 18, position: 1},
    {time: 24, position: 0},
    {time: 30, position: -1},
    {time: 36, position: -2},
    {time: 42, position: 1},
    {time: 48, position: 2},
    {time: 54, position: -2},
    {time: 60, position: 1},
    {time: 66, position: 3},
    {time: 72, position: 0},
    {time: 78, position: -2},
    {time: 84, position: 1},
    {time: 90, position: 2},
    {time: 96, position: 0},
  ]

//hier beginnt das durchgehen der obigen Daten und die Berechnungen
for (let i = 0; i < data.length; i++){
  let currentTime = data[i].time;
  let currentPosition = data[i].position;
  //Nullpunkte rausfinden
  if ((previousPosition<=0 && currentPosition>=0) || (previousPosition>=0 && currentPosition<=0)){
    let zeroTime;
    if ((Math.abs(previousPosition)<Math.abs(currentPosition)) && lastZeroTime !== previousTime){
      zeroTime = previousTime;
    } else if ((Math.abs(previousPosition)>Math.abs(currentPosition)) && lastZeroTime !== currentTime) {
      zeroTime = currentTime;
    } else if ((Math.abs(previousPosition)==Math.abs(currentPosition)) && lastZeroTime !== currentTime){
      middleTime = previousTime+(currentTime-previousTime)/2
      zeroTime = middleTime;
    }

    //Zeiten der Nullpunkte in zero_points liste abspeichern
    if (zeroTime && lastZeroTime !== zeroTime){
      zero_points.push(zeroTime);
      lastZeroTime = zeroTime;
      
      //frequenz berechnen beginnen, wenn wir 3 Nullpunkte haben
      if (zero_points.length<4 && zero_points.length % 3 == 0 || zero_points.length>4 && zero_points.length % 2 == 1) {
        let freq = Math.abs(zero_points[zero_points.length-1]-zero_points[zero_points.length-3]);
        frequency.push(freq);

        //Amplitude für frequenz speichern und zurücksetzen
        if (zero_points.length > 2) {
          resetAmplitude();
        }
      }
    }

  }

  checkAmplitude(currentPosition);

  position_output.push(currentPosition);
  previousPosition = currentPosition;
  previousTime = currentTime;
}

// Letzte Amplitude speichern
if (zero_points.length % 2 == 1) {
  resetAmplitude();
}


//Resultate im terminal ersichtlich
  console.log("Position output:", position_output);//nur für Datenkontrolle
  console.log("Zero points:", zero_points);//Nullpunkte
  console.log("Amplitude max:", amplitude_each_max);//Wert des Maximums pro Periode
  console.log("Amplitude min:", amplitude_each_min);//Wert des Minimums pro Periode
  console.log("Frequencies:", frequency);
  console.log("Amplitude:", amplitude);


  // ==================== BEGIN NEW CODE FOR COMPARING FREQUENCY AND AMPLITUDE ====================

// frequency
// Function to compare last 3 frequencies
function compareFrequencies() {
  // Need at < 3 frequencies else it says there isnt enough data (could still change 3 if its too little)
  if (frequency.length < 3) {
    return {
      changes: [],
      percentChanges: [],
      trend: "Not enough data"
    };
  }

  // Get the last 3 frequencies
  const lastThreeFreq = frequency.slice(-3);
  
  // Calculate changes 
  const changes = [];
  const percentChanges = [];
  
  for (let i = 1; i < lastThreeFreq.length; i++) {
    const change = lastThreeFreq[i] - lastThreeFreq[i-1];
    const percentChange = (change / lastThreeFreq[i-1]) * 100;
    
    changes.push(change.toFixed(2));
    percentChanges.push(percentChange.toFixed(2));
  }
  
  // Determine trend (increase, decrease, stable)
  let trend = "Stable";
  const avgPercentChange = percentChanges.reduce((sum, change) => sum + parseFloat(change), 0) / percentChanges.length;
  
  if (Math.abs(avgPercentChange) < 5) {
    trend = "Stable";
  } else if (avgPercentChange > 0) {
    trend = "Increasing";
  } else {
    trend = "Decreasing";
  }
  
  return {
    changes,
    percentChanges,
    trend
  };
}

//Amplitude
// Function to compare last 3 amplitudes
function compareAmplitudes() {
  // Need < 3 amplitudes to make a comparison (we can still change the number 3)
  if (amplitude.length < 3) {
    return {
      changes: [],
      percentChanges: [],
      trend: "Not enough data"
    };
  }

  // Get the last 3 amplitudes
  const lastThreeAmp = amplitude.slice(-3);
  
  // Calculate changes
  const changes = [];
  const percentChanges = [];
  
  for (let i = 1; i < lastThreeAmp.length; i++) {
    const change = lastThreeAmp[i] - lastThreeAmp[i-1];
    const percentChange = (change / lastThreeAmp[i-1]) * 100;
    
    changes.push(change.toFixed(2));
    percentChanges.push(percentChange.toFixed(2));
  }
  
  // Determine overall change
  let trend = "Stable";
  const avgPercentChange = percentChanges.reduce((sum, change) => sum + parseFloat(change), 0) / percentChanges.length;
  
  if (Math.abs(avgPercentChange) < 5) {
    trend = "Stable";
  } else if (avgPercentChange > 0) {
    trend = "Increasing";
  } else {
    trend = "Decreasing";
  }
  
  return {
    changes,
    percentChanges,
    trend
  };
}

// Run the comparison functions
const frequencyAnalysis = compareFrequencies();
const amplitudeAnalysis = compareAmplitudes();

// Log the results
console.log("\n===== FREQUENCY ANALYSIS =====");
console.log("Last 3 frequencies:", frequency.slice(-3));
console.log("Absolute changes:", frequencyAnalysis.changes);
console.log("Percentage changes:", frequencyAnalysis.percentChanges.map(change => `${change}%`));
console.log("Overall trend:", frequencyAnalysis.trend);

console.log("\n===== AMPLITUDE ANALYSIS =====");
console.log("Last 3 amplitudes:", amplitude.slice(-3));
console.log("Absolute changes:", amplitudeAnalysis.changes);
console.log("Percentage changes:", amplitudeAnalysis.percentChanges.map(change => `${change}%`));
console.log("Overall trend:", amplitudeAnalysis.trend);

// ==================== END CODE FOR COMPARING FREQUENCY AND AMPLITUDE ====================
//Resultate auf app anzeigen
  return (
    <View style={styles.container}>
      <Text>Zero points at:</Text>
      <Text>Zero points at:</Text>
      <Text>{zero_points[0]} seconds</Text>
      <Text>{zero_points[1]} seconds</Text>
      <Text>{zero_points[2]} seconds</Text>
      <Text>{zero_points[3]} seconds</Text>
      <Text>{zero_points[4]} seconds</Text>
      <Text>{zero_points[5]} seconds</Text>
      <Text></Text>
      <Text>Frequencies:</Text>
      <Text>First {frequency[0]} seconds</Text>
      <Text>Second {frequency[1]} seconds</Text>
      <Text>Third {frequency[2]} seconds</Text>
      <Text></Text>
      <Text>Amplitude: {amplitude[0]}</Text>
      <Text>Amplitude: {amplitude[1]}</Text>
      <Text>Amplitude: {amplitude[2]}</Text>
      <Text></Text>
      <Text>Amplitude first maximum: {amplitude_each_max[0]}</Text>
      <Text>Amplitude first minimum: {amplitude_each_min[0]}</Text>
    </View>
  );
}


//layout von app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

});


