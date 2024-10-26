// screens/PracticeScreen.js
import React, { useState, useReducer } from "react";
import { View, Pressable } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Text, Button, Box, Row, Spacer, Stack } from "native-base";

import useSpacedRepetition from "../hooks/useSpacedRepetition";

import DeckCard from "../../components/DeckCard";

import deck from "../../data/decks/deck-essential-spanish-vocabulary-for-beginners-1729550475609.json";

const PracticeScreen = () => {
  const route = useRoute();

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "CORRECT":
          return {
            ...state,
            correct: state.correct + 1,
            currentCardIndex: state.currentCardIndex + 1,
            completed: state.currentCardIndex + 1 === deck.cards.length,
          };
        case "INCORRECT":
          return {
            ...state,
            incorrect: state.incorrect + 1,
            currentCardIndex: state.currentCardIndex + 1,
            completed: state.currentCardIndex + 1 === deck.cards.length,
          };
        default:
          return state;
      }
    },
    {
      correct: 0,
      incorrect: 0,
      currentCardIndex: 0,
    }
  );
  const markCorrect = () => dispatch({ type: "CORRECT" });
  const markIncorrect = () => dispatch({ type: "INCORRECT" });
  const currentCard = deck.cards[state.currentCardIndex];

  return (
    <Box style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {currentCard && (
        <DeckCard front={currentCard.front} back={currentCard.back} />
      )}
      {state.completed ? (
        <Stack>
          <Text>Practice completed</Text>

          <Text>Correct: {state.correct}</Text>
          <Text>Incorrect: {state.incorrect}</Text>
        </Stack>
      ) : (
        <Row padding={10}>
          {deck.cards}
          <Button onPress={markIncorrect}>Incorrect</Button>
          <Spacer width={100} />
          <Button onPress={markCorrect}>Correct</Button>
        </Row>
      )}
    </Box>
  );
};

export default PracticeScreen;
