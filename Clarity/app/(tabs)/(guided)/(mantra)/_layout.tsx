import { Stack, Slot } from "expo-router";
import { StatusBar } from "react-native";
import React from "react"

export default function MantraLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen 
          name="mantraMeditation" 
          options={{
            headerTitle: "Mantra Meditation",
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: "#50d4cc",
            },
            headerTintColor: '#000',
          }}
        />
      </Stack>
    </>
  );
}
