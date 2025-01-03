import { View, StyleSheet, Image, Text } from "react-native";
import Button from "@/components/Button"
import ImageViewer from "@/components/ImageViewer"
import LinkButton from "@/components/LinkButton"


export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.explanation}>
          Benefit from a wide range of different guided meditation styles to improve focus, mental wellbeing and overall better energy levels. 
        </Text>
        <Text style={styles.explanation}>
           
        </Text>
        <Text style={styles.explanation}>
          We are here to guide you into a calmer future.
        </Text>
      </View>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={require("../../../assets/custom_images/logo.png")} />
      </View>
      <View style={styles.footerContainer}>
        <LinkButton label="Breathing Meditation" destination="/breathingMeditation"/>
      </View>
      <View style={styles.footerContainer}>
        <LinkButton label="Mantra Meditation" destination="/mantraMeditation"/>
      </View>
      <View style={styles.footerContainer}>
        <LinkButton label="Body Scan" destination="/bodyScan"/>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#152238"
  },
  text: {
    fontSize: 30,
    color: "#FFF",
    textAlign: "center",
    justifyContent: "center"
  },
  textContainer: {
    flex: 1/3,
    padding: 50,
  },
  explanation: {
    fontSize: 15,
    color: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#FFF"
  },
  imageContainer: {
    padding: 1,
    flex: 1/2,    
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1/3,
    alignItems: 'center',
    
  },
});
