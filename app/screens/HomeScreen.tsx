// screens/HomeScreen.js
import React from "react";
import { Button, Text, View, Box, Spacer, Stack } from "native-base";

import { decks } from "../../mockData/decks"; // Import the mock decks

import theme from "../../components/theme";

// Link to DeckScreen
export default function HomeScreen({ navigation }) {
  console.log({ decks });
  return (
    <Box
      style={{
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack>
        <Button onPress={() => navigation.navigate("Practice")}>
          Practice
        </Button>
        <Spacer height={10} />
        <Button onPress={() => navigation.navigate("Decks")}>Decks</Button>
        <Spacer height={10} />
        <Button onPress={() => navigation.navigate("Settings")}>
          Settings
        </Button>
      </Stack>
    </Box>
  );
}
