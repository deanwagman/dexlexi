// screens/PracticeScreen.js
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRoute } from "@react-navigation/native";

import useSpacedRepetition from "../hooks/useSpacedRepetition";

const PracticeScreen = () => {
  const route = useRoute();
  const [isFlipped, setIsFlipped] = useState(false);
  // const { deck } = route.params; // Access the deck data from route params
  const deck = {
    id: 1,
    title: "Deck 1",
    cards: [
      { id: 1, front: "Front 1", back: "Back 1" },
      { id: 2, front: "Front 2", back: "Back 2" },
      { id: 3, front: "Front 3", back: "Back 3" },
    ],
  };
  const card = deck.cards[0]; // Get the first card from the deck

  console.log({ deck });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ marginBottom: 20 }}>
        <Pressable
          onPress={() => {
            setIsFlipped(!isFlipped);
          }}
        >
          <View
            style={
              isFlipped
                ? {
                    width: 200,
                    backgroundColor: "green",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 20,
                  }
                : {
                    width: 200,
                    backgroundColor: "red",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 20,
                  }
            }
          >
            <Text style={{ fontSize: 18 }}>
              {isFlipped ? card.back : card.front}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default PracticeScreen;
