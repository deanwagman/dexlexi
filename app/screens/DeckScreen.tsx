// screens/DeckScreen.js
import React from "react";
import { ScrollView, Box, Text, Pressable, FlatList } from "native-base";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "@react-navigation/native";
import collectionExpo from "../../data/collections/collection-User Interface Design Theory-1730146684288";

import DeckCover from "../../components/cards/DeckCover";
import useStorage from "../../hooks/useStorage";

export default function DeckScreen({ navigation }) {
  const { setItem, getItem } = useStorage();

  const query = useQuery({
    queryKey: ["decks"],
    queryFn: async () => {
      return await Promise.all(
        collectionExpo.decks.map(async (deck) => {
          console.log({ deck });
          const progress = await getItem(`progress-${deck.id}`);
          console.log({ progress });
          return {
            ...deck,
            progress,
          };
        })
      );
    },
  });

  if (query.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (query.isError) {
    return <Text>Error loading decks</Text>;
  }

  const ShadowCard = ({ index }) =>
    index < 10 ? (
      <Box
        key={index}
        bg="white"
        shadow={2}
        rounded="lg"
        width="100%"
        height="200px" // Adjust height to make it consistent for shadow effect
        position="absolute"
        zIndex={-index}
        style={{
          transform: [{ translateX: index * 10 }, { translateY: -index * 10 }],
          opacity: Math.max(1 - index * 0.2, 0),
        }}
      />
    ) : null;

  console.log({ query });

  return (
    <FlatList
      data={query.data}
      renderItem={({ item }) => {
        return (
          <Pressable
            mx={4} // Adjusted for better layout
            my={4} // Adjusted for better layout
            onPress={() => navigation.navigate("Practice", { deck: item })}
          >
            <DeckCover text={item.name} />
            {item.cards.map((card, index) => (
              <ShadowCard key={index} index={index} />
            ))}
            {/* Stats */}
            {item.progress?.correct !== undefined && (
              <Text mt={2}>
                {item.progress.correct} / {item.cards.length}
              </Text>
            )}
          </Pressable>
        );
      }}
      keyExtractor={(item) => item.name}
      contentContainerStyle={{ paddingBottom: 16 }} // Ensure spacing for last items
    />
  );
}
