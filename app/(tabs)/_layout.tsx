import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";


export default function TabsLayout() {
  return (
    <Tabs
        screenOptions={{
           tabBarActiveTintColor: "#000",
           headerStyle: {
                backgroundColor: "#152238",
           },
           headerShadowVisible: false,
           headerTintColor: "#FFF",
           tabBarStyle: {
            backgroundColor: "#FFF",
            borderTopWidth: 0,
            elevation: 0,
           },
           
        }}
    >
        <Tabs.Screen
            name="(biofeed)"
            options={{
                title: "Biofeedback",
                headerShown: false,
                tabBarIcon: ({}) => 
                    <Image 
                        source={require("../../assets/custom_images/nav3.png")}
                        style={{width: 30, height:30}}
                        resizeMode="contain"
                    />}}
        />

        <Tabs.Screen
            name="(guided)"
            options={{
                title: "Guided Meditation",
                headerShown: false,
                tabBarIcon: ({}) => 
                    <Image 
                        source={require("../../assets/custom_images/nav2.png")}
                        style={{width: 30, height:30}}
                        resizeMode="contain"
                    />}}
        />
        <Tabs.Screen 
            name="(account1)"
            options={{
                title: "Your Account",
                headerShown: false,
                tabBarIcon: ({}) => 
                    <Image 
                        source={require("../../assets/custom_images/nav1.png")}
                        style={{width: 30, height:30}}
                        resizeMode="contain"
                    />
            }}
        />
       
    </Tabs>
  );
}