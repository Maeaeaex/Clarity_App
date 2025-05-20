import { Text, View, StyleSheet } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";
import AudioButton from "@/components/AudioButton";

export default function Choose_m() {
    return (
  
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.explanation}>
            Find below our guided mantra meditations
          </Text>
        </View>
        <View style={styles.imageWrapper}>
          <ImageViewer imgSource={require("../../../../assets/custom_images/mantra.png")} />
        </View>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonWrapper}>
            {/*<Button label="Learn mantra meditation" />*/}
            <AudioButton audioFile={require("../../../../assets/audio/mantra.mp3")} playText="Learn mantra meditation"/>
          </View>
          <View style={styles.buttonWrapper}>
            <Button label="Counting meditation" />
            {/*<AudioButtonTry audioFile={require("../../../../assets/audio/test2.mp3")} playText="Counting meditation"/>*/}
          </View>
          <View style={styles.buttonWrapper}>
            {/*<Button label="Loving-Kindness-Mantra" />*/}
            <AudioButton audioFile={require("../../../../assets/audio/kindness.mp3")} playText="Loving-Kindness-Mantra"/>
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
      backgroundColor: "#50d4cc",
      padding: 20,
    },
    textContainer: {
      flex: 1/1.7,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    imageWrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonsContainer: {
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    buttonWrapper: {
      marginVertical: 25, // Gleicher vertikaler Abstand zwischen allen Buttons
      width: "80%", // Optional: Einheitliche Breite für Buttons
      alignItems: "center", // Zentriere Buttons horizontal
    },
    explanation: {
      fontSize: 15,
      color: "#000",
      textAlign: "justify",
    },
  });