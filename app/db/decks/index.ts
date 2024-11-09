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
