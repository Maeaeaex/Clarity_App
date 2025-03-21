import { Stack, Slot } from "expo-router";
import { StatusBar } from "react-native";
import React from "react"

export default function BreathLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen 
          name="breathingMeditation" 
          options={{
            headerTitle: "Breathing Meditation",
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#ffdcbc",
            },
            headerTintColor: '#000',
          }}
        />
        <Stack.Screen 
          name="choose" 
          options={{
            headerTitle: "Breathing Meditation",
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#ffdcbc",
            },
            headerTintColor: '#000',
          }}
        />
      </Stack>
    </>
  );
}
