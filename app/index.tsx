// App.js or App.tsx
import React from "react";
import { SafeAreaView } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NativeBaseProvider } from "native-base";
import { useFonts, Exo2_700Bold } from "@expo-google-fonts/exo-2";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import AppLoading from "expo-app-loading";

import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { db } from "./db";

import theme from "../components/theme";

import HomeScreen from "./screens/HomeScreen"; // Your custom screens
import DeckScreen from "./screens/DeckScreen";
import PracticeScreen from "./screens/PracticeScreen";
import SettingsScreen from "./screens/SettingsScreen";

// Create a client for React Query
const queryClient = new QueryClient();

// Create a stack navigator
const Stack = createStackNavigator();

function MainStack() {
  const [fontsLoaded] = useFonts({
    Exo2_700Bold,
    Roboto_400Regular,
  });

  useDrizzleStudio(db);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider theme={theme} style={{ flex: 1 }}>
          <Stack.Navigator style={{ flex: 1 }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Practice"
              component={PracticeScreen}
              style={{ flex: 1 }}
            />
            <Stack.Screen
              name="Decks"
              component={DeckScreen}
              style={{ flex: 1 }}
            />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </NativeBaseProvider>
      </QueryClientProvider>
    </SafeAreaView>
  );
}

export default function App() {
  return <MainStack />;
}
