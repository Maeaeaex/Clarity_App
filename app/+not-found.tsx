import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import React from "react";

export default function NotFoundScreen() {
  return (
    <>
        <Stack.Screen options={{ title: 'Oops! Not Found' }} />
        <View style={styles.container}>
            <Link href="/biofeed" style={styles.button}> {/* immer zurück zu biofeed */}
                Go back to Home screen!
            </Link>
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#152238',//farbe geändert, wegen kontrast
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#FFF',
  },
});
