import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Accelerometer } from "expo-sensors";

const AccelerometerComponent = () => {
  console.log("AccelerometerGraph is rendering!");
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<ReturnType<typeof Accelerometer.addListener> | null>(null);

  const { x, y, z } = data;

  const subscribe = () => {
    const newSubscription = Accelerometer.addListener(accelerometerData => {
      const absoluteData = {
        x: accelerometerData.x,
        y: accelerometerData.y,
        z: accelerometerData.z,
      };
      setData(absoluteData);
    });
    setSubscription(newSubscription);
  };

  const unsubscribe = () => {
    subscription?.remove(); // Safely call remove if subscription exists
    setSubscription(null); // Reset subscription to null
  };

  useEffect(() => {
    Accelerometer.setUpdateInterval(4); // 250 Hz
    subscribe(); // Start listening on mount
    return () => unsubscribe(); // Clean up on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accelerometer:</Text>
      <Text style={styles.title}>(in g's where 1g = 9.81 m/s^2)</Text>
      <Text style={styles.data}>x: {(x*9.81).toFixed(5)}</Text>
      <Text style={styles.data}>y: {(y*9.81).toFixed(5)}</Text>
      <Text style={styles.data}>z: {(z*9.81).toFixed(5)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFF",
  },
  data: {
    fontSize: 16,
    color: "#FFF",
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "60%",
  },
});

export default AccelerometerComponent;

