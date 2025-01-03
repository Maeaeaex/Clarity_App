import { Text, View, StyleSheet } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import LinkButton from "@/components/LinkButton";

export default function BreathingMeditation() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.explanation}>
          Benefit from a wide range of different guided meditation styles to improve focus, mental wellbeing and overall better energy levels. 
          We are here to guide you into a calmer future.
        </Text>
      </View>
      <View style={styles.imageWrapper}>
         <ImageViewer imgSource={require("../../../../assets/custom_images/breathin.png")} />
      </View>
      <View style={styles.buttonWrapper}>
        <LinkButton label="Breathing Meditation" destination="/choose"/>
      </View>
      <View style={styles.textFootContainer}>
        <Text style={styles.explanation}>
          Breathing Meditation is a meditation technique that requires the meditator to stay focused on their breathing pattern.

          The meditator practises concentration by either focusing on the abdominal movement of the belly or the nasal area.

          This practise leads to a deepening of the connection between the meditator and their breath.

          Ultimately leading to a calm, deep meditative state.
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
    backgroundColor: "#ffdcbc",
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
  textFootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  explanation: {
    fontSize: 15,
    color: "#000",
    textAlign: "justify",
  },
});