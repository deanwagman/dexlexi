// screens/PracticeScreen.js
import React, { useState, useEffect, useReducer } from "react";
import { View, Pressable } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Text, Button, Box, Row, Spacer, Stack, ScrollView } from "native-base";

import useStorage from "../../hooks/useStorage";

import useSpacedRepetition from "../hooks/useSpacedRepetition";

import DeckCard from "../../components/DeckCard";

const PracticeScreen = () => {
  const route = useRoute();
  const deck = route.params.deck;

  const { setItem, getItem } = useStorage();

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "CORRECT":
          return {
            ...state,
            correct: state.correct + 1,
            correctCards: [
              ...state.correctCards,
              deck.cards[state.currentCardIndex],
            ],
            currentCardIndex: state.currentCardIndex + 1,
            completed: state.currentCardIndex + 1 === deck.cards.length,
          };
        case "INCORRECT":
          return {
            ...state,
            incorrect: state.incorrect + 1,
            incorrectCards: [
              ...state.incorrectCards,
              deck.cards[state.currentCardIndex],
            ],
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
      correctCards: [],
      incorrectCards: [],
      currentCardIndex: 0,
    }
  );
  const markCorrect = () => dispatch({ type: "CORRECT" });
  const markIncorrect = () => dispatch({ type: "INCORRECT" });
  const currentCard = deck.cards[state.currentCardIndex];

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

  useEffect(() => {
    state.completed && saveProgress();
  }, [state.completed]);

  return (
    <ScrollView p={60} style={{ flex: 1 }}>
      {/* {currentCard && (
        <DeckCard front={currentCard.front} back={currentCard.back} />
      )} */}
      {state.completed ? (
        <Stack>
          <Text>Practice completed</Text>

          <Text>Correct: {state.correct}</Text>
          <Text>Incorrect: {state.incorrect}</Text>
        </Stack>
      ) : (
        <Stack flex={1}>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              width: "100%",
              flex: 1,
              perspective: 10000,
            }}
          >
            {deck.cards.map((card, index) => {
              const isCurrentCard = index === state.currentCardIndex;
              const isPreviousCard = index < state.currentCardIndex;
              const isNextCard = index > state.currentCardIndex;
              const isAbsoluteNextCard = index === state.currentCardIndex + 1;
              const offsetIndex = index - state.currentCardIndex;

              if (isPreviousCard) {
                return <Box key={`empty-${index}`} />;
              }

              if (isCurrentCard) {
                return (
                  <DeckCard
                    key={index}
                    front={card.front}
                    back={card.back}
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "transform 0.5s",
                      width: "100%",
                      height: 600,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      transform: `translateX(0) translateY(0)`,
                      zIndex: 1,
                      top: 0,
                      left: 0,
                    }}
                  />
                );
              }

              if (isNextCard) {
                return (
                  <DeckCard
                    key={index}
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "transform 0.5s",
                      width: "100%",
                      height: 600,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      zIndex: -1 * index,
                      top: 0,
                      left: 0,
                      transform: `translateX(${
                        offsetIndex * 10
                      }px) translateY(-${offsetIndex * 10}px)`,
                    }}
                  />
                );
              }

              return (
                <DeckCard
                  key={index}
                  // Don't display the front of the card if it's not the current card
                  front={index === state.currentCardIndex ? card.front : ""}
                  back={index === state.currentCardIndex ? card.back : ""}
                  style={{
                    transformStyle: "preserve-3d",
                    transition: "transform 0.5s",
                    width: "100%",
                    height: 600,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    zIndex: index * -1,
                    transform: `translateX(${index * 10}px) translateY(-${
                      index * 10
                    }px)`,
                    filter: `opacity(${Math.max(1 - index * 0.2, 0)})`,
                    top: 0,
                    left: 0,
                  }}
                />
              );
            })}
          </Box>
          <Row padding={10}>
            <Button onPress={markIncorrect}>Incorrect</Button>
            <Spacer width={100} />
            <Button onPress={markCorrect}>Correct</Button>
          </Row>
        </Stack>
      )}
    </ScrollView>
  );
};

export default PracticeScreen;
