import { getDb } from "../index";

// id INTEGER PRIMARY KEY AUTOINCREMENT,
// name TEXT,
// userId INTEGER,
// progressPercentage REAL DEFAULT 0,
// FOREIGN KEY (userId) REFERENCES Users(id)

export const getDeck = async (deckId) => {
  try {
    const db = await getDb();
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

// Get all decks
export const getDecks = async () => {
  try {
    const db = await getDb(); // Ensure the database is correctly initialized
    console.log("Database connection successful:", db);

    const result = await db.getAllAsync("SELECT * FROM Decks;");
    console.log("Decks retrieved:", result);

    return result;
  } catch (error) {
    console.error("Error retrieving decks:", error);
    return null;
  }
};

export const createDeck = async (name) => {
  try {
    const db = await getDb();
    const result = await db.runAsync(
      `
        INSERT INTO Decks (name, userId)
        VALUES (?, ?);
        `,
      [name, 1],
    );
    return result;
  } catch (error) {
    console.error("Error creating deck:", error);
    return null;
  }
};

export const updateDeck = async (deckId, name) => {
  try {
    const db = await getDb();
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
    const db = await getDb();
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

export const updateDeckProgress = async (deckId, progressPercentage) => {
  try {
    const db = await getDb();
    const result = await db.runAsync(
      `
        UPDATE Decks
        SET progressPercentage = ?
        WHERE id = ?;
        `,
      [progressPercentage, deckId],
    );
    return result;
  } catch (error) {
    console.error("Error updating deck progress:", error);
    return null;
  }
};
