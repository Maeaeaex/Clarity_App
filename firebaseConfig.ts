import { initializeApp, getApps, getApp } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth"; // ✅ Use React Native Firebase

// ✅ Your Firebase Configuration (DO NOT share this publicly)
const firebaseConfig = {
  apiKey: "AIzaSyB56SU_9t18l9QNlMr_ripZH7PqNEusZ3w",
  authDomain: "clarityprojectdatabase.firebaseapp.com",
  projectId: "clarityprojectdatabase",
  storageBucket: "clarityprojectdatabase.appspot.com",
  messagingSenderId: "769996547932",
  appId: "1:769996547932:android:9c7d28b3192d3a2ba2c399",
};

// ✅ Initialize Firebase only if it's not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export { auth };
