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
                title: "Biofeedback",
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