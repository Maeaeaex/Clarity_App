import { Stack, Slot } from "expo-router";
import { StatusBar } from "react-native";
import React from "react"

export default function ScanLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen 
          name="bodyScan" 
          options={{
            headerTitle: "Body Scan",
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#152238",
            },
            headerTintColor: '#FFF',
          }}
        />
        <Stack.Screen  
          name="choose_scan" 
          options={{
            headerTitle: "Body Scan",
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#152238",
            },
            headerTintColor: '#FFF',
          }}
        />
      </Stack>
    </>
  );
}
