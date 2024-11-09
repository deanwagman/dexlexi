// screens/DeckScreen.js
import React from "react";
import { StyleSheet } from "react-native";
import { FlatList, Text, Pressable } from "native-base";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
// import collectionExpo from "../../data/collections/collection-User Interface Design Theory-1730146684288";
import DeckCover from "../../components/cards/DeckCover";

import { getDecks } from "../db/decks";

const DeckScreen = () => {
  const navigation = useNavigation();

  const query = useQuery({
    queryKey: ["decks"],
    queryFn: async () => {
      const decks = await getDecks(1);

      console.log({ decks });

      return decks;
    },
  });

  if (query.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (query.isError) {
    return <Text>Error loading decks</Text>;
  }

  const decks = query.data;

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        style={{
          ...styles.deckItem,
          zIndex: decks.length - index,
          height: 400,
          position: "relative",
        }}
        onPress={() => navigation.navigate("Practice", { deckId: item.id })}
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
