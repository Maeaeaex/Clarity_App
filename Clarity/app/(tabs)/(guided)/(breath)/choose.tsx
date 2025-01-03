import { Text, View, StyleSheet } from "react-native";
import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";
import AudioButton from "@/components/AudioButton";

export default function Choose() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.explanation}>
          Find below our guided breathing meditations
        </Text>
      </View>
      <View style={styles.imageWrapper}>
        <ImageViewer imgSource={require("../../../../assets/custom_images/breathin.png")} />
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <Button label="Learn how to breathe" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button label="4/7/8 - breathing methode" />
        </View>
        <View style={styles.buttonWrapper}>
          <AudioButton audioFile={require("../../../../assets/audio/test.mp3")} />
        </View>
        <View style={styles.textFootContainer}>
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
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonWrapper: {
    marginVertical: 10, // Gleicher vertikaler Abstand zwischen allen Buttons
    width: "80%", // Optional: Einheitliche Breite für Buttons
    alignItems: "center", // Zentriere Buttons horizontal
  },
  explanation: {
    fontSize: 15,
    color: "#000",
    textAlign: "justify",
  },
  textFootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
