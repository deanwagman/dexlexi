import React from "react";
import { View, FlatList } from "react-native";
import {
  Canvas,
  Rect,
  RoundedRect,
  Text,
  LinearGradient,
  Paint,
  Shadow,
  Skia,
  matchFont,
  Group,
} from "@shopify/react-native-skia";

// Example deck data
const decks = [
  { id: "1", title: "Deck 1", icon: "⚙️" },
  { id: "2", title: "Deck 2", icon: "🔮" },
  { id: "3", title: "Deck 3", icon: "🌐" },
  // Add more deck data
];

// Skia component for rendering a single card
const DeckCard = ({ front, back }) => {
  console.log({ front, back });

  // Create a font
  const fontFamily = "Helvetica";
  const fontStyle = {
    fontFamily,
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "bold",
  };
  const font = matchFont(fontStyle);

  return <Text x={10} y={10} text={front} font={font} color="black" />;
};

export default DeckCard;
