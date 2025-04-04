import { Text, View, StyleSheet } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import AccelerometerGraph from "@/components/AccelerometerGraph";
import PolarH10Monitor from "@/components/PolarH10Monitor";



export default function Read() {
  return (

    <View style={styles.container}>

      <View style={styles.textContainer}>
        <Text style={styles.explanation}>
          Learn meditation faster with biofeedback technology
        </Text>
      </View>
      <View style={styles.imageWrapper}>
        <ImageViewer imgSource={require("@/assets/custom_images/feedback.png")} />
      </View>
      <View style={styles.accelerometerContainer}>
        <AccelerometerGraph />
      </View>
      <View style={styles.monitorContainer}>
        <PolarH10Monitor />
      </View>
      <View style={styles.textFootContainer}>
        <Text style={styles.explanation}>
          Check
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#152238",
    padding: 60,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  accelerometerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textFootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  explanation: {
    fontSize: 15,
    color: "#FFF",
    textAlign: "justify",
  },
  monitorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});