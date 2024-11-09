import React, { useReducer, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Button, Box, HStack, VStack } from "native-base";
import { useTransition, animated } from "@react-spring/native";

import { useQuery } from "@tanstack/react-query";
import { getCards } from "../db/cards";
import { startSession, endSession } from "../db/session";
import { updateCardProgress } from "../db/cards";

import DeckCard from "../../components/DeckCard";
import PracticeSummary from "../../components/deck-data/PracticeSummary";

const initialState = {
  correct: 0,
  incorrect: 0,
  correctCards: [],
  incorrectCards: [],
  currentCardIndex: 0,
  completed: false,
  sessionId: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CORRECT":
      return {
        ...state,
        correct: state.correct + 1,
        correctCards: [...state.correctCards, action.card],
        currentCardIndex: state.currentCardIndex + 1,
      };
    case "INCORRECT":
      return {
        ...state,
        incorrect: state.incorrect + 1,
        incorrectCards: [...state.incorrectCards, action.card],
        currentCardIndex: state.currentCardIndex + 1,
      };
    case "END":
      return {
        ...state,
        completed: true,
      };
    case "SET_SESSION_ID":
      return {
        ...state,
        sessionId: action.sessionId,
      };
    default:
      return state;
  }
};

const PracticeScreen = () => {
  const route = useRoute();
  const deckId = route.params.deckId;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data: cards } = useQuery({
    queryKey: ["deck", deckId],
    queryFn: async () => {
      const cards = await getCards(deckId);
      dispatch({ type: "SET_CARDS", cards });

      return cards;
    },
    initialData: [],
  });

  const currentCard = cards[state.currentCardIndex];

  console.log({ currentCard });

  const markCorrect = async () => {
    const now = new Date().toISOString();
    await updateCardProgress(
      currentCard.id,
      1,
      now,
      null,
      currentCard.reviewCount + 1,
      currentCard.easeFactor,
    );
    dispatch({
      type: "CORRECT",
      card: currentCard,
    });

    if (state.currentCardIndex === cards.length - 1) {
      dispatch({ type: "END" });
      endSession(
        state.sessionId,
        new Date().toISOString(),
        state.correct,
        state.correct / cards.length,
      );
    }
  };

  const markIncorrect = async () => {
    const now = new Date().toISOString();
    await updateCardProgress(
      currentCard.id,
      0,
      now,
      null,
      currentCard.reviewCount + 1,
      currentCard.easeFactor,
    );
    dispatch({
      type: "INCORRECT",
      card: currentCard,
    });

    if (state.currentCardIndex === cards.length - 1) {
      dispatch({ type: "END" });
      endSession(
        state.sessionId,
        new Date().toISOString(),
        state.correct,
        state.correct / cards.length,
      );
    }
  };

  const AnimatedBox = animated(Box);

  const transitions = useTransition(currentCard, {
    key: state.currentCardIndex,
    from: { opacity: 0, x: 300 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: -300 },
    config: { tension: 200, friction: 15 },
  });

  useEffect(() => {
    const startTime = new Date().toISOString();
    // eslint-disable-next-line no-undef
    // const abortController = new AbortController();

    startSession(1, deckId, startTime)
      .then((sessionId) => {
        dispatch({ type: "SET_SESSION_ID", sessionId });
      })
      .catch((error) => {
        console.error("Error starting session:", error);
      });

    // return () => {
    //   abortController.abort();
    // };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {state.completed ? (
        <PracticeSummary
          correct={state.correct}
          incorrect={state.incorrect}
          total={cards.length}
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
              ) : null,
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
