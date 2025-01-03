import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import Button from "@/components/Button"
import ImageViewer from "@/components/ImageViewer";

export default function MantraMeditation() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.explanation}>
          Benefit from a wide range of different guided meditation styles to improve focus, mental wellbeing and overall better energy levels. 
          We are here to guide you into a calmer future.
        </Text>
      </View>
      <View style={styles.imageWrapper}>
         <ImageViewer imgSource={require("../../../../assets/custom_images/mantra.png")} />
      </View>
      <View style={styles.buttonWrapper}>
        <Button label="Breathing Meditation" />
      </View>
      <View style={styles.textFootContainer}>
        <Text style={styles.explanation}>
          Mantra Meditation is a Meditation technique that requires the meditator to repeat a specific word or sentance with deeper meaning in their head. 
          It can be any kind of phrase for instance: "Love is all there is." or "Life is great".
          The more the meditator repeats this mantra, the more the concentration and deepening oft the Meditation improves.
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
    backgroundColor: "#50d4cc",
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