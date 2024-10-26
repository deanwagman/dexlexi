import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NativeBaseProvider, Box, Container, Text } from "native-base";
import HomeScreen from "./screens/HomeScreen"; // Your custom screens
import DeckScreen from "./screens/DeckScreen";
import PracticeScreen from "./screens/PracticeScreen";
import SettingsScreen from "./screens/SettingsScreen";

import theme from "../components/theme";

const Stack = createStackNavigator();

function MainStack() {
  return (
    <NativeBaseProvider theme={theme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Practice" component={PracticeScreen} />
        <Stack.Screen name="Decks" component={DeckScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NativeBaseProvider>
  );
}

export default function App() {
  return <MainStack />;
}
