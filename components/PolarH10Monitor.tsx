import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
//import { PolarBle } from "rn-polar-ble-sdk";
import { LineChart } from "react-native-chart-kit";

export default function PolarH10Monitor() {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [heartRateData, setHeartRateData] = useState<number[]>([]);

  useEffect(() => {
    const initPolar = async () => {
      try {
        // Initialize Polar BLE
        await PolarBle.init();

        // Subscribe to heart rate data
        PolarBle.onHeartRateReceived((data) => {
          const { hr } = data; // Extract heart rate
          setHeartRate(hr);

          // Update heart rate data for the chart
          setHeartRateData((prevData) => {
            const updatedData = [...prevData, hr];
            // Limit the chart to the last 20 entries
            return updatedData.length > 20 ? updatedData.slice(-20) : updatedData;
          });
        });

        // Start scanning for devices
        PolarBle.startScanning();
      } catch (error) {
        console.error("Polar initialization error:", error);
      }
    };

    initPolar();

    return () => {
      // Clean up
      PolarBle.stopScanning();
      PolarBle.disconnectFromDevice();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Display Current Heart Rate */}
      <Text style={styles.title}>Current Heart Rate: {heartRate ?? "N/A"} bpm</Text>

      {/* Display Heart Rate Chart */}
      <LineChart
        data={{
          labels: heartRateData.map((_, index) => (index + 1).toString()),
          datasets: [
            {
              data: heartRateData,
              color: () => `rgba(255, 0, 0, 1)`, // Heart rate line color
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get("window").width - 40} // Adjust chart width
        height={220}
        chartConfig={{
          backgroundColor: "#1E2923",
          backgroundGradientFrom: "#1E2923",
          backgroundGradientTo: "#08130D",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: {
            r: "3",
            strokeWidth: "1",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          marginVertical: 20,
          borderRadius: 16,
        }}
      />

      {/* Display List of Recent Heart Rates */}
      <Text style={styles.subtitle}>Heart Rate History</Text>
      <FlatList
        data={heartRateData.map((rate, index) => ({ id: index.toString(), rate }))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.item}>{item.rate} bpm</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#152238",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFF",
    marginTop: 20,
  },
  item: {
    fontSize: 16,
    color: "#FFF",
    padding: 5,
  },
});
