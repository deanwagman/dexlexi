import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { Box, Text, Center } from "native-base";

import type { Deck } from "./cards/types";

// Example deck data
const decks = [
  { id: "1", title: "Deck 1", icon: "⚙️" },
  { id: "2", title: "Deck 2", icon: "🔮" },
  { id: "3", title: "Deck 3", icon: "🌐" },
  // Add more deck data
];

const DeckCard = ({ front, back, style }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "600",
        perspective: 1000,
        ...style,
      }}
    >
      <Box
        onPress={() => setIsFlipped(!isFlipped)}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.5s",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          width: "100%",
          height: "600",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Front of the card */}
        <Box
          bg="white"
          shadow={2}
          rounded="lg"
          width="100%"
          height="600"
          p={4}
          m={2}
          style={{
            zIndex: 1,
            position: "absolute",
            backfaceVisibility: "hidden",
          }}
        >
          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: "black",
            }}
          >
            {front}
          </Text>
        </Box>

        {/* Back of the card */}
        <Box
          bg="white"
          shadow={2}
          rounded="lg"
          width="100%"
          height="600"
          p={4}
          m={2}
          style={{
            position: "absolute",
            zIndex: -1,
            transform: "rotateY(180deg)",
          }}
        >
          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: "black",
            }}
          >
            {back}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default DeckCard;
