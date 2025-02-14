import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
//import { ScrollView } from 'react-native-gesture-handler';

const App = () => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [pw, setPw] = useState('');
  const [pwC, setPwC] = useState('');

  return (

<SafeAreaView style={{flex:1, justifyContent: 'center'}}>

<View style={styles.container}>

      <Text style={{fontWeight:'700', paddingBottom: 10, fontSize: 20}}>Registration</Text>

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


<View style={styles.buttonLogin}>
    <Text >Already registered? </Text>
    <TouchableOpacity onPress={() => {}}>
        <Text style={{fontWeight:'700'}}>Login</Text>
    </TouchableOpacity>

    </View>
    </View>
    </SafeAreaView>  

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
});


export default App;



/* already registered? Login original

    <View style={{flexDirection:'row', justifyContent:'center', paddingBottom: 100}}>
    <Text style={{textAlign:'center'}}>Already registered?</Text>
    <TouchableOpacity onPress={() => {}}>
        <Text style={{fontWeight:'700'}}> Login</Text>
    </TouchableOpacity>

    </View>

*/


//import { Text, View } from "react-native";

//export default function Index() {
 // return (
  //  <View
  //    style={{
   //     flex: 1,
     //   justifyContent: "center",
       // alignItems: "center",
  //    }}
    //>
  //    <Text>Edit app/index.tsx to edit this screen.</Text>
   // </View>
//  );
//}
