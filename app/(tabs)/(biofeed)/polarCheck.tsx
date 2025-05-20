import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";0
import AudioButton from "../../../components/AudioButton";
import LinkButton from "@/components/LinkButton";



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
      <Text style={styles.explanation}>
          Do you have a Polar H10 that you want to use for addiontional Biofeedback functionalities?
        </Text>
      <View style={styles.buttonWrapper}>
        <LinkButton label="Yes" destination = "/readHR"/>
      </View>
      <View style={styles.buttonWrapper}>
        <LinkButton label="No" destination = "/read"/>
      </View>
      <View style={styles.textFootContainer}>
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