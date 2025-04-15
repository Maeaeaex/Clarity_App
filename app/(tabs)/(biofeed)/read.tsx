import { Text, View, StyleSheet, ScrollView } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import AccelerometerGraph from "@/components/AccelerometerGraph_button";

export default function Read() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.explanation}>
          Learn meditation faster with biofeedback technology
        </Text>
      </View>

      <View style={styles.imageWrapper}>
        <ImageViewer imgSource={require("@/assets/custom_images/feedback.png")} />
      </View>

      <View style={styles.accelerometerContainer}>
        <AccelerometerGraph
          samplingRate={125}
          bufferDurationSeconds={10} 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#152238",
    paddingVertical: 20,
  },
  textContainer: {
    marginBottom: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  imageWrapper: {
    marginBottom: 10,
    alignItems: "center",
  },
  accelerometerContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  explanation: {
    fontSize: 15,
    color: "#FFF",
    textAlign: "center",
  },
});


