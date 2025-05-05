import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";
import LinkButton from "@/components/LinkButton";

import AudioButton from "../../../components/AudioButton";



export default function Biofeed() {
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
      <View style={styles.buttonWrapper}>
        {/*<Button label="Start now!"/>*/}
        <LinkButton label="Start now!" destination="/read"/>
      </View>
      <View style={styles.textFootContainer}>
        <Text style={styles.explanation}>
          Your breathing pattern is being measured to detect your mind-wandering state. 
          If the app detects your mind wander, it will help you come back to the present moment by a AI voice cue.
          This leading to faster, better meditation learning.
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
});