import { Text, View, StyleSheet } from "react-native";
import LinkButton from "@/components/LinkButton";
import ImageViewer from "@/components/ImageViewer";

export default function ScanMeditation() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.explanation}>
          Benefit from a wide range of different guided meditation styles to improve focus, mental wellbeing and boost overall energy levels. 
          We are here to guide you into a calmer future.
        </Text>
      </View>
      <View style={styles.imageWrapper}>
         <ImageViewer imgSource={require("../../../../assets/custom_images/scan.png")} />
      </View>
      <View style={styles.buttonWrapper}>
        <LinkButton label="Body Scan" destination="/choose_scan" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.explanation}>
          Body Scan Meditation is a technique that allows the meditator to focus on bodily sensations. 
          The meditator can focus on small and also on big parts of the body. This helps the meditator connect with their body in a deeper and more non-judgmental way. 
          This leads to a relaxed and calm body-mind connection.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#152238",
    padding: 20,
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
  explanation: {
    fontSize: 15,
    color: "#FFF",
    textAlign: "justify",
  },
});