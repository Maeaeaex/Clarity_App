import { Stack, Slot } from "expo-router";
import { StatusBar } from "react-native";
import React from "react";

export default function AccountLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
            name="account"
            options={{
                title: "Your account",
                headerTitleAlign: "center",
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: "#152238",
                  },
                headerTintColor: '#FFF',
            }}

        />

        <Stack.Screen
            name="rewards"
            options={{
                headerTitle: "Rewards", //hinzugefügt
                headerTitleAlign: "center",
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: "#152238",
                  },
                headerTintColor: '#FFF',
            }}

        />

        <Stack.Screen
            name="progress"
            options={{
                title: "Weekly Progress", 
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
