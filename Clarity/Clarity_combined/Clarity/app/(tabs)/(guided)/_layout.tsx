import { Stack, Slot } from "expo-router";
import { StatusBar } from "react-native";
import React from "react"

export default function GuidedLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
            name="index"
            options={{
                title: "Guided Meditation",
                headerTitleAlign: "center",
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: "#152238",
                  },
                headerTintColor: '#FFF',
            }}

        />
        <Stack.Screen
            name="(mantra)"
            options={{
                title: "Guided Meditation",
                headerShown: false,
              }}
        />
        <Stack.Screen
            name="(breath)"
            options={{
                title: "Guided Meditation",
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="(scan)"
            options={{
                title: "Guided Meditation",
                headerShown: false,
              }}
        />
      </Stack>
    </>
  );
}
