import { View, StyleSheet, Image, Text } from "react-native";
import ImageViewer from "@/components/ImageViewer"
import LinkButton from "@/components/LinkButton"


export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.explanation}>
          Benefit from a wide range of different guided meditation styles to improve focus, mental wellbeing and boost overall energy levels. 
        </Text>
        <Text style={styles.explanation}>
           
        </Text>
        <Text style={styles.explanation}>
          We are here to guide you into a calmer future.
        </Text>
      </View>
      <View style={styles.imageWrapper}>
        <ImageViewer imgSource={require("../../../assets/custom_images/logo.png")} />
      </View>
      <View style={styles.buttonsContainer}>
      <View style={styles.buttonWrapper}>
        <LinkButton label="Breathing Meditation" destination="/breathingMeditation"/>
      </View>
      <View style={styles.buttonWrapper}>
        <LinkButton label="Mantra Meditation" destination="/mantraMeditation"/>
      </View>
      <View style={styles.buttonWrapper}>
        <LinkButton label="Body Scan" destination="/bodyScan"/>
      </View>
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
  explanation: {
    fontSize: 15,
    color: "#FFF",
    textAlign: "justify",
  },
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    marginVertical: 20, // Gleicher vertikaler Abstand zwischen allen Buttons
    width: "80%", // Optional: Einheitliche Breite für Buttons
    alignItems: "center",
  },
  buttonsContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
