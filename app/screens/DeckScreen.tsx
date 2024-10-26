// screens/DeckScreen.js
import React from "react";
import { View, Text, FlatList, Button } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Canvas, Group } from "@shopify/react-native-skia";
import { decks } from "../../mockData/decks"; // Import the mock decks

import DeckCard from "../../components/DeckCard";

export default function DeckScreen({ navigation }) {
  console.log({
    decks,
  });
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View>
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18 }}>{item.name}</Text>
              <Button
                title="Practice"
                onPress={() => navigation.navigate("Practice", { deck: item })}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
}
