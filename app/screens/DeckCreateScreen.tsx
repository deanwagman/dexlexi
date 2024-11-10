import React, { useState } from "react";
import { useCreateDeck } from "../../hooks/useDecks";
import { useCreateCard } from "../../hooks/useCards";
import {
  Box,
  Input,
  Button,
  VStack,
  FormControl,
  Text,
  ScrollView,
} from "native-base";

const DeckCreateScreen = () => {
  const [deckName, setDeckName] = useState("");
  const [cards, setCards] = useState([]);
  const createDeckMutation = useCreateDeck();
  const createCardMutation = useCreateCard();

  const handleAddCard = () => {
    setCards([...cards, { front: "", back: "" }]);
  };

  const handleCreateDeck = async () => {
    const userId = 1; // Replace with actual userId
    try {
      const deckResult = await createDeckMutation.mutateAsync({
        name: deckName,
        userId,
      });
      const deckId = deckResult.insertId; // Adjust based on your DB response
      await Promise.all(
        cards.map((card) =>
          createCardMutation.mutateAsync({
            deckId,
            front: card.front,
            back: card.back,
            difficulty: 1,
            masteryLevel: 0,
            lastReviewed: null,
            nextReviewDate: null,
            reviewCount: 0,
            easeFactor: 2.5,
          }),
        ),
      );
      // Navigate to the deck details screen or reset the form
    } catch (error) {
      console.error("Error creating deck and cards:", error);
    }
  };

  return (
    <ScrollView p={4}>
      <VStack space={4}>
        <FormControl isRequired>
          <FormControl.Label>Deck Name</FormControl.Label>
          <Input
            placeholder="Enter deck name"
            value={deckName}
            onChangeText={setDeckName}
          />
        </FormControl>

        <Text fontSize="lg" fontWeight="bold">
          Cards
        </Text>

        {cards.map((card, index) => (
          <Box key={index} borderWidth={1} borderRadius="md" p={3} mb={2}>
            <FormControl mb={2}>
              <FormControl.Label>Front</FormControl.Label>
              <Input
                placeholder="Front of the card"
                value={card.front}
                onChangeText={(text) => {
                  const newCards = [...cards];
                  newCards[index].front = text;
                  setCards(newCards);
                }}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Back</FormControl.Label>
              <Input
                placeholder="Back of the card"
                value={card.back}
                onChangeText={(text) => {
                  const newCards = [...cards];
                  newCards[index].back = text;
                  setCards(newCards);
                }}
              />
            </FormControl>
          </Box>
        ))}

        <Button onPress={handleAddCard}>Add Card</Button>
        <Button onPress={handleCreateDeck} colorScheme="primary">
          Create Deck
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default DeckCreateScreen;
