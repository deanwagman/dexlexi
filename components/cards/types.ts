// Type representing a single flashcard
export type Flashcard = {
  id: string; // Unique identifier for the flashcard
  front: string; // Content displayed on the front of the flashcard
  back: string; // Content displayed on the back of the flashcard
  tags?: string[]; // Optional array of tags for categorization
};

// Type representing a deck of flashcards
export type Deck = {
  id: string; // Unique identifier for the deck
  name: string; // Name of the deck
  description?: string; // Optional description of the deck
  flashcards: Flashcard[]; // Array of flashcards belonging to this deck
};
