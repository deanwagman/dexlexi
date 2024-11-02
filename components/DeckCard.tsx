// components/DeckCard.js
import React, { useState, useRef } from "react";
import {
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Box, Text } from "native-base";

const DeckCard = ({ front, back, style }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    const newIsFlipped = !isFlipped;
    setIsFlipped(newIsFlipped);
    Animated.spring(animatedValue, {
      toValue: newIsFlipped ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: false, // Required for opacity animation
    }).start();
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
    opacity: animatedValue.interpolate({
      inputRange: [0, 90, 180],
      outputRange: [1, 0, 0],
    }),
  };

  const backAnimatedStyle = {
    transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
    opacity: animatedValue.interpolate({
      inputRange: [0, 90, 180],
      outputRange: [0, 0, 1],
    }),
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableWithoutFeedback onPress={flipCard}>
        <View style={styles.cardWrapper}>
          {/* Front Side */}
          <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
            <Box style={styles.cardFace}>
              <Text style={styles.cardText}>{front}</Text>
            </Box>
          </Animated.View>

          {/* Back Side */}
          <Animated.View style={[styles.flipCard, backAnimatedStyle]}>
            <Box style={styles.cardFace}>
              <Text style={styles.cardText}>{back}</Text>
            </Box>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default DeckCard;

const styles = StyleSheet.create({
  container: {
    // Center the container's content horizontally and vertically
    alignItems: "center",
    justifyContent: "center",
  },
  cardWrapper: {
    // Define explicit dimensions
    width: 250,
    height: 350,
  },
  flipCard: {
    // Fill the cardWrapper
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    position: "absolute",
    // Center the flipCard content
    alignItems: "center",
    justifyContent: "center",
  },
  cardFace: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    // Center content within the card face
    justifyContent: "center",
    alignItems: "center",
    // Add shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Add elevation for Android
    elevation: 5,
  },
  cardText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
});
