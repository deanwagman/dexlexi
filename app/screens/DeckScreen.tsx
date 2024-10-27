// screens/DeckScreen.js
import React from "react";
import {
  ScrollView,
  View,
  Center,
  Text,
  Button,
  Box,
  SafeAreaView,
  Container,
  FlatList,
  Pressable,
} from "native-base";

import { useRoute } from "@react-navigation/native";
import { Canvas, Group } from "@shopify/react-native-skia";

import collectionNativeBase from "../../data/collections/collection-React-Native-Base-1730063718899";

import DeckCard from "../../components/DeckCard";

import DeckCover from "../../components/cards/DeckCover";

export default function DeckScreen({ navigation }) {
  const ShadowCard = ({ index }) =>
    index < 10 ? (
      <Box
        key={index}
        bg="white"
        shadow={2}
        rounded="lg"
        width="100%"
        height="600"
        style={{
          position: "absolute",
          zIndex: index * -1,
          transform: `translateX(${index * 10}px) translateY(-${index * 10}px)`,
          filter: `opacity(${Math.max(1 - index * 0.2, 0)})`,
          top: 0,
          left: 0,
        }}
      />
    ) : null;

  console.table(collectionNativeBase.decks);

  // Flat list of decks
  return (
    <ScrollView style={{ flex: 1 }}>
      <FlatList
        data={collectionNativeBase.decks}
        renderItem={({ item }) => (
          <Pressable
            mx={100}
            my={100}
            onPress={() => navigation.navigate("Practice", { deck: item })}
          >
            <DeckCover text={item.name} style={{ cursor: "pointer" }} />
            {item.cards.map((card, index) => (
              <ShadowCard key={index} index={index} />
            ))}
          </Pressable>
        )}
        keyExtractor={(item) => item.name}
      />
    </ScrollView>
  );
}
