// screens/DeckScreen.js
import React from "react";
import { StyleSheet } from "react-native";
import { FlatList, Text, Pressable } from "native-base";
import { useNavigation } from "@react-navigation/native";
import DeckCover from "../../components/cards/DeckCover";

import { useDecks } from "../../hooks/useDecks";

const DeckScreen = () => {
  const navigation = useNavigation();

  const { data: decks, isLoading, isError } = useDecks();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading decks</Text>;
  }

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
