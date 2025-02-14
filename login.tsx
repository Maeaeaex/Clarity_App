import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
//import { ScrollView } from 'react-native-gesture-handler';

const App = () => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [pw, setPw] = useState('');
  const [pwC, setPwC] = useState('');

  return (
   // <SafeAreaView style={{flex:1, justifyContent: 'center'}}>
    <View style={styles.container}>

    <Text style={{fontWeight:'700', paddingTop: 26, padding: 16, fontSize: 20}}>Login</Text>

    <View style={{flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, padding: 8,
                 borderTopWidth: 1,borderTopColor: '#ccc', paddingHorizontal: 20, 
    }}>
    <TextInput placeholder="email" style={{flex: 1}} keyboardType="email-address"/>
    </View>

    <View style={styles.textInput}>
    <TextInput placeholder="password" style={{flex: 1}} secureTextEntry/>

    <TouchableOpacity onPress={() => {}}>
        <Text style={{alignItems:'center', fontWeight:'700', padding: 8}}>Forgot?</Text>
    </TouchableOpacity>

    </View>

    <View style={styles.textOr}>
    <Text style={{textAlign:'center', color: '#666'}}>Or, login with ...</Text>
    <Text style={{textAlign:'center', color: '#666', paddingTop: 12, paddingBottom: 20}}>[Google, Facebook, etc]</Text>


    </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    //paddingHorizontal: 20, 
    paddingVertical: 30, 
  },
  textOr: {
    flexDirection: 'column', 
    justifyContent: 'center',
    textAlign:'center',
    padding: 40, 
    color: '#666',
  },
  textInput: {
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 8,
    paddingHorizontal: 20, 
    marginBottom:25,
  },
});


export default App;
