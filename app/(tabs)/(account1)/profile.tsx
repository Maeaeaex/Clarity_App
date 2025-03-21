import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Button from "@/components/Button";


export default function Profile() {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [pw, setPw] = useState('');
  const [pwC, setPwC] = useState('');


  return (
    <View style={styles.container}>

      <Text style={{fontWeight:'700', paddingBottom: 10, fontSize: 20}}>Profile</Text>

      <Text style={{ marginVertical: 16 }}>
        {name ? `Hi ${name}!` : 'Name:'}
      </Text>

      <TextInput
        style={{ padding: 8, backgroundColor: '#ecf0f1' }}
        placeholder= 'name'
        onChangeText={text => setName(text)}
      />

      <Text style={{ marginVertical: 16 }}>
        {value ? `Your email is ${value}!` : 'Email:'}
      </Text>

      <TextInput
        style={{ padding: 8, backgroundColor: '#ecf0f1' }}
        placeholder= 'muster@example.com'
        onChangeText={text => setValue(text)}
      />

      <Text style={{ marginVertical: 16 }}>
        {pw ? `Your password is ${pw}` : 'Password:'}
      </Text>

      <TextInput
        style={{ padding: 8, backgroundColor: '#ecf0f1' }}
        placeholder= '********'
        onChangeText={text => setPw(text)}
        secureTextEntry
      />

      <Text style={{ marginVertical: 16 }}>
        {pwC ? `Your password is ${pwC}!` : 'Password confirmation:'}
      </Text>
      <TextInput
        style={{ padding: 8, backgroundColor: '#ecf0f1' }}
        placeholder= '********'
        onChangeText={text => setPwC(text)}
        secureTextEntry
      />

      <View style={styles.buttonWrapper}>
        <Button label="Save"/>
      </View>

    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    //backgroundColor: "#152238", wenn gleich wie bei account
    justifyContent: 'center',
    paddingHorizontal: 20, 
    paddingVertical: 30, 
  },
  buttonLogin: {
    flexDirection: 'row', 
    justifyContent: 'center',
    textAlign:'center',
    padding: 40, 
  },
  buttonWrapper: {
    flex: 1/2,
    justifyContent: "center",
    alignItems: "center",
  },
});


//export default App;
