import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface TextInputComponentProps {
  label: string; // Label to display, e.g., "Name: Max"
  value: string; // Current input value
  onChangeText: (text: string) => void; // Function to update the state
  placeholder?: string; // Placeholder text for the input
}

const TextInputComponent: React.FC<TextInputComponentProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFF',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#FFF',
  },
});

export default TextInputComponent;
