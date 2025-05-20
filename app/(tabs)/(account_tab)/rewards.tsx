import { View, StyleSheet, Text } from 'react-native';
import LinkButton from "@/components/LinkButton"; //später
import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";

export default function Rewards() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.explanation}>
          Here, you can find all the awards you have received for your meditation practice. The longer you meditate, the more stickers you can collect.
          Share your stickers with your friends!
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
      <View style={styles.buttonWrapper}>
        <Button label="Current rewards"/>
      </View>

      <View style={styles.imageWrapper}>
         <ImageViewer imgSource={require("../../../assets/images/reward_1.png")} /> 
      </View>
         {/*    Bild selber zu assets vom internet hinzugefügt->später selber erstellte hier   */}
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
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  buttonWrapper: {
    marginVertical: 20, // Gleicher vertikaler Abstand zwischen allen Buttons
    width: "80%", // Optional: Einheitliche Breite für Buttons
    alignItems: "center",
  },
  explanation: {
    fontSize: 15,
    color: "#FFF",
    textAlign: "justify",
  },
//hier hinzugefügt damit bild bei button näher
buttonsContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});