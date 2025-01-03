import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ImageViewer from '@/components/ImageViewer';
import TextInputComponent from '@/components/TextInputComp';
import * as ImagePicker from "expo-image-picker";
import FuncButton from '@/components/FuncButton';

const PlaceHolderImage = require("@/assets/images/icon.png")

export default function Account() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

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
      <View style={styles.imageWrapper}>
        <ImageViewer imgSource={selectedImage || PlaceHolderImage} />
      </View>
      <View style={styles.buttonWrapper}>
        <FuncButton theme="primary" label="Choose a photo" onPress={pickImageAsync} />
        <FuncButton label="Use this photo" />
      </View>
      <View style={styles.inputsWrapper}>
        <TextInputComponent
          label={`Username: ${username || ""}`}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />
        <TextInputComponent
          label={`Name: ${name || ""}`}
          value={name}
          onChangeText={setName} 
          placeholder="Enter your name"
        />

        <TextInputComponent
          label={`Surname: ${surname || ""}`}
          value={surname}
          onChangeText={setSurname}
          placeholder="Enter your surname"
        />

        {/* Email Field */}
        <TextInputComponent
          label={`Email: ${email || ""}`}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#152238',
    paddingHorizontal: 20, 
    paddingVertical: 30, 
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 20, 
  },
  buttonWrapper: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 30, 
  },
  inputsWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  textInput: {
    marginBottom: 15
  },
});