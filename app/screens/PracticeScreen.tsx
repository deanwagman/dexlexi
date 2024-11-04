import React, { useEffect, useReducer } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Text, Button, Box, HStack, VStack } from "native-base";
import { useTransition, animated } from "@react-spring/native";

import useStorage from "../../hooks/useStorage";
import defaultDeck from "../../data/decks/deck-default";
import DeckCard from "../../components/DeckCard";
import PracticeSummary from "../../components/deck-data/PracticeSummary";

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

  const AnimatedBox = animated(Box);

  const transitions = useTransition(currentCard, {
    key: state.currentCardIndex,
    from: { opacity: 0, x: 300 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: -300 },
    config: { tension: 200, friction: 15 },
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {state.completed ? (
        <PracticeSummary
          correct={state.correct}
          incorrect={state.incorrect}
          total={deck.cards.length}
        />
      ) : (
        <VStack flex={1} alignItems="center" justifyContent="center" space={4}>
          <Box style={styles.cardArea}>
            {transitions((style, item) =>
              item ? (
                <AnimatedBox
                  style={[
                    styles.cardContainer,
                    {
                      opacity: style.opacity,
                      transform: [{ translateX: style.x }],
                    },
                  ]}
                >
                  <DeckCard
                    front={item.front}
                    back={item.back}
                    key={state.currentCardIndex}
                  />
                </AnimatedBox>
              ) : null
            )}
          </Box>
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
  cardArea: {
    width: "100%",
    height: 400,
  },
  cardContainer: {
    width: "100%",
    minHeight: 400,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
});
