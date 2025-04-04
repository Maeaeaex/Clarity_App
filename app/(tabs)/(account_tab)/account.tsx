import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ImageViewer from '@/components/ImageViewer';
import * as ImagePicker from "expo-image-picker";
import FuncButton from '@/components/FuncButton';
import LinkButton from "@/components/LinkButton"; //hinzugefügt
import Button from "@/components/Button"; // diese beide hinzugefügt für alles ausser foto aussuchen

const PlaceHolderImage = require("@/assets/images/icon.png")

export default function Account() {

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      console.log(result);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.explanation}>
          Your Username
        </Text>
      </View>

      <View style={styles.imageWrapper}>
        <ImageViewer imgSource={selectedImage || PlaceHolderImage} />
      </View>
      <View style={styles.buttonsContainer}>
      <View style={styles.imageButtonWrapper}>
        <FuncButton theme="primary" label="Choose a photo" onPress={pickImageAsync} />
      </View>
    

        {/*hier die neuen buttons*/}
      <View style={styles.buttonWrapper}>
        <LinkButton label="Edit profile" destination="/profile"/>
      </View>

      <View style={styles.buttonWrapper}>
        <LinkButton label="Rewards" destination="/rewards"/>
      </View>
      <View style={styles.buttonWrapper}>
        <LinkButton label="Weekly progress" destination="/progress"/>
      </View>
      <View style={styles.buttonWrapper}>
        <Button label="Mood summary"/>
      </View>
     </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: '#152238',
    padding: 20, 
  },
  imageWrapper: {
    alignItems: 'flex-start',
    marginBottom: 20, 
    paddingLeft: 30, // das für schöneres layout hinzugefügt
  },
  //für image button neu gemacht
  imageButtonWrapper: {
    marginVertical: 10, // Gleicher vertikaler Abstand zwischen allen Buttons
    width: "80%", // Optional: Einheitliche Breite für Buttons
    alignItems: "center",
  },
  buttonWrapper: {
    marginVertical: 10, // Gleicher vertikaler Abstand zwischen allen Buttons
    width: "80%", // Optional: Einheitliche Breite für Buttons
    alignItems: "center",
  },
  buttonsContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
  },
  explanation: {
    fontSize: 25,
    color: "#FFF",
    textAlign: "justify",
  },
});