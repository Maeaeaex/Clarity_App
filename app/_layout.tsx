import { Stack, Slot } from "expo-router";
import { StatusBar } from "react-native";
import React from "react"

export default function RootLayout() {
  return (
    <>
      <StatusBar 
        barStyle={"dark-content"}
        translucent={true}
      />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen
          name="+not-found"
          options={{}}
        />
      </Stack>
    </>
  );
}
