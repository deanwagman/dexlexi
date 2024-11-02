// screens/PracticeScreen.js
import React, { useEffect, useReducer } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Text, Button, Box, HStack, VStack } from "native-base";

import useStorage from "../../hooks/useStorage";
import defaultDeck from "../../data/decks/deck-default";
import DeckCard from "../../components/DeckCard";

const initialState = {
  correct: 0,
  incorrect: 0,
  correctCards: [],
  incorrectCards: [],
  currentCardIndex: 0,
  completed: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CORRECT":
      return {
        ...state,
        correct: state.correct + 1,
        correctCards: [...state.correctCards, action.card],
        currentCardIndex: state.currentCardIndex + 1,
        completed: state.currentCardIndex + 1 >= action.totalCards,
      };
    case "INCORRECT":
      return {
        ...state,
        incorrect: state.incorrect + 1,
        incorrectCards: [...state.incorrectCards, action.card],
        currentCardIndex: state.currentCardIndex + 1,
        completed: state.currentCardIndex + 1 >= action.totalCards,
      };
    default:
      return state;
  }
};

const PracticeScreen = () => {
  const route = useRoute();
  const deck = route.params?.deck || defaultDeck;

  const { setItem } = useStorage();

  const [state, dispatch] = useReducer(reducer, initialState);

  const currentCard = deck.cards[state.currentCardIndex];

  const markCorrect = () =>
    dispatch({
      type: "CORRECT",
      card: currentCard,
      totalCards: deck.cards.length,
    });

  const markIncorrect = () =>
    dispatch({
      type: "INCORRECT",
      card: currentCard,
      totalCards: deck.cards.length,
    });

  useEffect(() => {
    if (state.completed) {
      const saveProgress = async () => {
        const progress = {
          correct: state.correct,
          incorrect: state.incorrect,
          correctCards: state.correctCards,
          incorrectCards: state.incorrectCards,
        };
        console.log("Saving progress", progress);
        await setItem(`progress-${deck.id}`, progress);
      };
      saveProgress();
    }
  }, [state.completed]);

  const renderCurrentCard = () => {
    if (!currentCard) return null;

    return (
      <DeckCard
        front={currentCard.front}
        back={currentCard.back}
        key={state.currentCardIndex}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {state.completed ? (
        <VStack space={4} alignItems="center">
          <Text fontSize="2xl" bold>
            Practice Completed
          </Text>
          <Text>Correct: {state.correct}</Text>
          <Text>Incorrect: {state.incorrect}</Text>
        </VStack>
      ) : (
        <VStack flex={1} alignItems="center" justifyContent="center" space={4}>
          <Box style={styles.cardContainer}>{renderCurrentCard()}</Box>
          <HStack space={10} padding={4}>
            <Button onPress={markIncorrect} colorScheme="red">
              Incorrect
            </Button>
            <Button onPress={markCorrect} colorScheme="green">
              Correct
            </Button>
          </HStack>
        </VStack>
      )}
    </ScrollView>
  );
};

export default PracticeScreen;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  cardContainer: {
    width: "100%",
    minHeight: 400,
    alignItems: "center",
    justifyContent: "center",
  },
});
