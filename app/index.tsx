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
      <Stack.Navigator
        screenOptions={{
          header: ({ navigation }) => {
            return (
              <Container>
                <Text fontSize="md" onPress={() => navigation.navigate("Home")}>
                  Home
                </Text>
                <Text
                  fontSize="md"
                  onPress={() => navigation.navigate("Practice")}
                >
                  Practice
                </Text>
                <Text
                  fontSize="md"
                  onPress={() => navigation.navigate("Decks")}
                >
                  Decks
                </Text>
              </Container>
            );
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Practice" component={PracticeScreen} />
        <Stack.Screen name="Decks" component={DeckScreen} />
      </Stack.Navigator>
    </NativeBaseProvider>
  );
}

export default function App() {
  return <MainStack />;
}
