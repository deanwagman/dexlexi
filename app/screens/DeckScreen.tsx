// screens/DeckScreen.js
import React from "react";
import { StyleSheet } from "react-native";
import { FlatList, Box, Text, Pressable } from "native-base";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import collectionExpo from "../../data/collections/collection-User Interface Design Theory-1730146684288";

import DeckCover from "../../components/cards/DeckCover";
import useStorage from "../../hooks/useStorage";

const DeckScreen = () => {
  const navigation = useNavigation();
  const { setItem, getItem } = useStorage();

  const query = useQuery({
    queryKey: ["decks"],
    queryFn: async () => {
      return await Promise.all(
        collectionExpo.decks.map(async (deck) => {
          const progress = await getItem(`progress-${deck.id}`);
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

  const decks = query.data;

  const ShadowCard = ({ index }) =>
    index < 10 ? (
      <Box
        key={index}
        bg="white"
        shadow={2}
        rounded="lg"
        width="100%"
        height={400}
        position="absolute"
        zIndex={-index}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: [{ translateX: index * 10 }, { translateY: index * -10 }],
          opacity: Math.max(1 - index * 0.2, 0),
        }}
      />
    ) : null;

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        style={{
          ...styles.deckItem,
          zIndex: decks.length - index,
          height: 400,
          position: "relative",
        }}
        onPress={() => navigation.navigate("Practice", { deck: item })}
      >
        <DeckCover
          title={item.name}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 400,
          }}
        />
        <Box style={styles.shadowContainer}>
          {item.cards.slice(0, 5).map((_, idx) => (
            <ShadowCard key={idx} index={idx + 1} />
          ))}
        </Box>
        {item.progress?.correct !== undefined && (
          <Text mt={2} style={styles.progress}>
            Progress: {item.progress.correct} / {item.cards.length}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <FlatList
      data={decks}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
};

export default DeckScreen;

const styles = StyleSheet.create({
  deckItem: {
    marginHorizontal: 16,
    marginVertical: 8,
    position: "relative",
    height: 400,
  },
  shadowContainer: {
    zIndex: -1,
    position: "relative",
    top: 0,
  },
  progress: {
    position: "absolute",
    top: 0,
    right: 10,
    opacity: 0.6,
    fontSize: 12,
  },
});
