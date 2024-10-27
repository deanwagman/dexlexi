// screens/DeckScreen.js
import React from "react";
import { View, Text, FlatList, Button, Box } from "native-base";

import { useRoute } from "@react-navigation/native";
import { Canvas, Group } from "@shopify/react-native-skia";
import { decks } from "../../mockData/decks"; // Import the mock decks

import DeckCard from "../../components/DeckCard";

import DeckCover from "../../components/cards/DeckCover";

export default function DeckScreen({ navigation }) {
  const ShadowCard = ({ index }) => (
    <Box
      bg="white"
      shadow={2}
      rounded="lg"
      width="68.9%"
      height="38vh"
      style={{
        position: "absolute",
        zIndex: index * -1,
        transform: `translateX(${index * 10}px) translateY(-${index * 10}px)`,
        filter: `opacity(${1 - index * 0.2}) blur(${
          index * 2
        }px) drop-shadow(0 0 ${index * 2}px rgba(0, 0, 0, 0.2))`,
      }}
    />
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Box key={item.name}>
            <DeckCover
              text={item.name}
              onPress={() => navigation.navigate("Practice")}
            />
            {item.cards.map((card, index) => (
              <ShadowCard key={index} index={index} />
            ))}
          </Box>
        )}
      />
    </View>
  );
}
