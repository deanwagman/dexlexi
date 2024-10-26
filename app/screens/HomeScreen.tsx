// screens/HomeScreen.js
import React from "react";
import { Button, Text, View, Container } from "native-base";

import { decks } from "../../mockData/decks"; // Import the mock decks

import theme from "../../components/theme";

// Link to DeckScreen
export default function HomeScreen({ navigation }) {
  console.log({ decks });
  return (
    <Container centerContent style={{ height: "100vh" }}>
      <Button onPress={() => navigation.navigate("Decks")}>Go to Decks</Button>
    </Container>
  );
}
