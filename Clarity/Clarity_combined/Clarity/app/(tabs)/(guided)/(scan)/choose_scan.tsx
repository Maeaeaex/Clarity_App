import { Text, View, StyleSheet } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";
import AudioButtonTry from "@/components/AudioButtonTry"; //ich hier mein button

export default function Choose_scan() {
    return (
  
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.explanation}>
            Find below our guided body scan meditations
          </Text>
        </View>
        <View style={styles.imageWrapper}>
          <ImageViewer imgSource={require("../../../../assets/custom_images/scan.png")} />
        </View>
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonWrapper}>
            {/*<Button label="Learn Body Scan" />*/}
            <AudioButtonTry audioFile={require("../../../../assets/audio/body.mp3")} playText="Learn Body Scan"/>
          </View>
          <View style={styles.buttonWrapper}>
            {/*<Button label="Shutting off the Body" />*/}
            <AudioButtonTry audioFile={require("../../../../assets/audio/body_relax.mp3")} playText="Shutting off the Body"/>
          </View>
          <View style={styles.buttonWrapper}>
            <Button label="Pain and Emotion in the Body" />
            {/*<AudioButtonTry audioFile={require("../../../../assets/audio/test.mp3")} playText="Pain and Emotion in the Body"/> 
            //audio datei noch ersetzen hier bei body scan*/}
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
      color: "#FFF",
      textAlign: "justify",
    },
  });