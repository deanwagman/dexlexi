// components/DeckCard.js
import React, { useState } from "react";
import { TouchableWithoutFeedback, StyleSheet } from "react-native";
import { Box, Text, Heading } from "native-base";
import { useSpring, animated } from "@react-spring/native";

const AnimatedBox = animated(Box);

const DeckCard = ({ front, back, style }) => {
  const [flipped, setFlipped] = useState(false);

  const { angle } = useSpring({
    to: { angle: flipped ? 180 : 0 },
    from: { angle: 0 },
    config: { mass: 1, tension: 210, friction: 20 },
  });

  const frontAnimatedStyle = {
    transform: [
      { perspective: 1000 },
      {
        rotateY: angle.to({
          range: [0, 180],
          output: ["0deg", "180deg"],
        }),
      },
    ],
    opacity: angle.to({
      range: [0, 90, 180],
      output: [1, 0, 0],
    }),
  };

  const backAnimatedStyle = {
    transform: [
      { perspective: 1000 },
      {
        rotateY: angle.to({
          range: [0, 180],
          output: ["180deg", "360deg"],
        }),
      },
    ],
    opacity: angle.to({
      range: [0, 90, 180],
      output: [0, 0, 1],
    }),
  };

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };

  return (
    <TouchableWithoutFeedback onPress={handleFlip}>
      <AnimatedBox style={[styles.container, style]}>
        {/* Front Side */}
        <AnimatedBox style={[styles.flipCard, frontAnimatedStyle]}>
          <Box style={styles.cardFace}>
            <Heading style={styles.cardHeading}>{front}</Heading>
          </Box>
        </AnimatedBox>

        {/* Back Side */}
        <AnimatedBox
          style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle]}
        >
          <Box style={styles.cardFace}>
            <Text style={styles.cardText}>{back}</Text>
          </Box>
        </AnimatedBox>
      </AnimatedBox>
    </TouchableWithoutFeedback>
  );
};

export default DeckCard;

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 350,
    alignItems: "center",
    justifyContent: "center",
  },
  flipCard: {
    backfaceVisibility: "hidden",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  flipCardBack: {
    // Flip the back side initially so it renders correctly
    transform: [{ rotateY: "180deg" }],
  },
  cardFace: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  cardHeading: {
    fontSize: 32,
    lineHeight: 40,
    textAlign: "center",
  },
  cardText: {
    fontSize: 20,
    lineHeight: 30,
    opacity: 0.8,
    textAlign: "left",
  },
});
