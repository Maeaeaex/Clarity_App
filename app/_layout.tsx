import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { FirebaseAuthTypes } from "@react-native-firebase/auth"; // ✅ Correct Firebase import
import {auth} from "../firebaseConfig"

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    // ✅ Firebase Auth State Listener
    const subscriber = auth.onAuthStateChanged((user: FirebaseAuthTypes.User | null) => {
      console.log("onAuthStateChanged", user);
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return subscriber; // ✅ Unsubscribe on component unmount
  }, [initializing]);

  if (initializing) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}
