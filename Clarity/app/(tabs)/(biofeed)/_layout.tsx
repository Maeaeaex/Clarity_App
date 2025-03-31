import { Stack, Slot } from "expo-router";
import { StatusBar } from "react-native";
import React from "react"

export default function BiofeedLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
            name="biofeed"
            options={{
                title: "Biofeedback Meditation",
                headerTitleAlign: "center",
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: "#152238",
                  },
                headerTintColor: '#FFF',
            }}

        />
        <Stack.Screen
            name="polarCheck"
            options={{
                title: "polarCheck",
                headerTitleAlign: "center",
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: "#152238",
                  },
                headerTintColor: '#FFF',
            }}

        />
        <Stack.Screen
            name="read"
            options={{
                title: "Biofeedback Meditation",
                headerTitleAlign: "center",
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: "#152238",
                  },
                headerTintColor: '#FFF',
            }}

        />
        <Stack.Screen
            name="readHR"
            options={{
                title: "Read with HR",
                headerTitleAlign: "center",
                headerShadowVisible: false,
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
