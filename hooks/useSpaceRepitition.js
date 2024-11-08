// A React hook for spaced repetition, which you can use in your React Native flashcard app.

// This implementation is based on the SM-2 algorithm, which is used in popular apps like Anki.
// It helps to determine the optimal time to review flashcards for long-term retention.

import { useState, useCallback } from "react";

const useSpacedRepetition = () => {
  const [cardData, setCardData] = useState(new Map());

  // Function to add or update a card's data.
  // Each card has properties like interval, repetition count, easiness factor, and due date.
  // interval: Number of days between reviews.
  // repetition: How many times the card has been successfully remembered in a row.
  // easiness: A factor that affects how quickly the interval grows (higher means easier to recall).
  // dueDate: The next date the card should be reviewed.
  const addOrUpdateCard = useCallback(
    (
      cardId,
      {
        interval = 1,
        repetition = 0,
        easiness = 2.5,
        dueDate = new Date(),
      } = {},
    ) => {
      setCardData((prevCardData) => {
        const updatedCardData = new Map(prevCardData);
        updatedCardData.set(cardId, {
          interval,
          repetition,
          easiness,
          dueDate,
        });
        return updatedCardData;
      });
    },
    [],
  );

  // Function to process the user's answer and update the card data.
  const processAnswer = useCallback((cardId, quality) => {
    setCardData((prevCardData) => {
      const card = prevCardData.get(cardId);
      if (!card) {
        throw new Error("Card not found");
      }

      const { interval, repetition, easiness /* dueDate */ } = card;

      // Quality should be a value between 0 and 5, representing how well the user remembered the card.
      // 0 means complete failure, and 5 means perfect recall.
      const clampedQuality = Math.max(0, Math.min(quality, 5));

      // This calculation adjusts the easiness factor based on the user's recall quality, ensuring it doesn't fall below 1.3.
      // The formula aims to modify the easiness factor to make future reviews more or less frequent, depending on how well the user remembers the card.
      // A lower quality results in a lower easiness factor, meaning more frequent reviews.
      let newEasiness =
        easiness +
        0.1 -
        (5 - clampedQuality) * (0.08 + (5 - clampedQuality) * 0.02);
      newEasiness = Math.max(1.3, newEasiness); // Ensure the easiness factor is at least 1.3 to prevent overly long intervals.

      let newRepetition = repetition;
      let newInterval = interval;
      let newDueDate = new Date();

      if (clampedQuality >= 3) {
        // If the user remembers the card well (quality >= 3), increase the repetition count.
        newRepetition += 1;
        if (newRepetition === 1) {
          newInterval = 1; // First repetition, review the next day.
        } else if (newRepetition === 2) {
          newInterval = 6; // Second repetition, review after 6 days.
        } else {
          newInterval = Math.round(interval * newEasiness); // Subsequent repetitions, interval grows based on easiness.
        }
        newDueDate.setDate(newDueDate.getDate() + newInterval); // Set the next due date based on the new interval.
      } else {
        // If the user fails to recall (quality < 3), reset repetition and interval.
        newRepetition = 0;
        newInterval = 1; // Start over with a 1-day interval.
        newDueDate.setDate(newDueDate.getDate() + newInterval);
      }

      // Update the card data with the new values.
      const updatedCardData = new Map(prevCardData);
      updatedCardData.set(cardId, {
        interval: newInterval,
        repetition: newRepetition,
        easiness: newEasiness,
        dueDate: newDueDate,
      });

      return updatedCardData;
    });
  }, []);

  // Function to get cards that are due for review.
  // It filters out cards whose due date is today or earlier, meaning they are ready to be reviewed.
  const getDueCards = useCallback(() => {
    const now = new Date();
    return Array.from(cardData.entries()).filter(
      ([, card]) => card.dueDate <= now,
    );
  }, [cardData]);

  return { addOrUpdateCard, processAnswer, getDueCards };
};

export default useSpacedRepetition;

// Example usage in a React component:
// const { addOrUpdateCard, processAnswer, getDueCards } = useSpacedRepetition();
// addOrUpdateCard('card1');
// processAnswer('card1', 4); // User rates their recall quality from 0 to 5
// console.log(getDueCards());
