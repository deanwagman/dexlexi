import { db } from "../index";

// id INTEGER PRIMARY KEY AUTOINCREMENT,
// name TEXT,
// userId INTEGER,
// totalCards INTEGER DEFAULT 0,
// cardsLearned INTEGER DEFAULT 0,
// progressPercentage REAL DEFAULT 0,
// FOREIGN KEY (userId) REFERENCES Users(id)

export const getDeck = async (deckId) => {
  try {
    const result = await db.getAsync(
      `
        SELECT * FROM Decks WHERE id = ?;
        `,
      [deckId],
    );
    return result;
  } catch (error) {
    console.error("Error getting deck:", error);
    return null;
  }
};

export const getDecks = async (userId) => {
  try {
    const result = await db.getAllAsync(
      `
        SELECT * FROM Decks WHERE userId = ?;
        `,
      [userId],
    );
    return result;
  } catch (error) {
    console.error("Error getting decks:", error);
    return null;
  }
};

export const createDeck = async (name, userId) => {
  try {
    const result = await db.runAsync(
      `
        INSERT INTO Decks (name, userId)
        VALUES (?, ?);
        `,
      [name, userId],
    );
    return result;
  } catch (error) {
    console.error("Error creating deck:", error);
    return null;
  }
};

export const updateDeck = async (deckId, name) => {
  try {
    const result = await db.runAsync(
      `
        UPDATE Decks
        SET name = ?
        WHERE id = ?;
        `,
      [name, deckId],
    );
    return result;
  } catch (error) {
    console.error("Error updating deck:", error);
    return null;
  }
};

export const deleteDeck = async (deckId) => {
  try {
    const result = await db.runAsync(
      `
        DELETE FROM Decks
        WHERE id = ?;
        `,
      [deckId],
    );
    return result;
  } catch (error) {
    console.error("Error deleting deck:", error);
    return null;
  }
};

export const updateDeckProgress = async (
  deckId,
  totalCards,
  cardsLearned,
  progressPercentage,
) => {
  try {
    const result = await db.runAsync(
      `
        UPDATE Decks
        SET totalCards = ?, cardsLearned = ?, progressPercentage = ?
        WHERE id = ?;
        `,
      [totalCards, cardsLearned, progressPercentage, deckId],
    );
    return result;
  } catch (error) {
    console.error("Error updating deck progress:", error);
    return null;
  }
};
