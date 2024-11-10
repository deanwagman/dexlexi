import { db } from "../index";

// id INTEGER PRIMARY KEY AUTOINCREMENT,
// deckId INTEGER,
// front TEXT,
// back TEXT,
// difficulty INTEGER DEFAULT 1,
// masteryLevel INTEGER DEFAULT 0,
// lastReviewed DATETIME,
// nextReviewDate DATETIME,
// reviewCount INTEGER DEFAULT 0,
// easeFactor REAL DEFAULT 2.5,
// FOREIGN KEY (deckId) REFERENCES Decks(id)

export const getCard = async (cardId) => {
  try {
    const result = await db.getAsync(
      `
        SELECT * FROM Cards WHERE id = ?;
        `,
      [cardId],
    );
    return result;
  } catch (error) {
    console.error("Error getting card:", error);
    return null;
  }
};

export const getCards = async (deckId) => {
  try {
    const result = await db.getAllAsync(
      `
        SELECT * FROM Cards WHERE deckId = ?;
        `,
      [deckId],
    );
    return result;
  } catch (error) {
    console.error("Error getting cards:", error);
    return null;
  }
};

export const updateCardProgress = async (
  cardId,
  masteryLevel,
  lastReviewed,
  nextReviewDate,
  reviewCount,
  easeFactor,
) => {
  try {
    const result = await db.runAsync(
      `
            UPDATE Cards
            SET masteryLevel = ?, lastReviewed = ?, nextReviewDate = ?, reviewCount = ?, easeFactor = ?
            WHERE id = ?;
            `,
      [
        masteryLevel,
        lastReviewed,
        nextReviewDate,
        reviewCount,
        easeFactor,
        cardId,
      ],
    );
    console.log("Card updated with ID:", cardId);

    return result;
  } catch (error) {
    console.error("Error updating card:", error);
    return null;
  }
};

export const createCard = async (
  deckId,
  front,
  back,
  difficulty,
  masteryLevel,
  lastReviewed,
  nextReviewDate,
  reviewCount,
  easeFactor,
) => {
  try {
    const result = await db.runAsync(
      `
        INSERT INTO Cards (deckId, front, back, difficulty, masteryLevel, lastReviewed, nextReviewDate, reviewCount, easeFactor)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `,
      [
        deckId,
        front,
        back,
        difficulty,
        masteryLevel,
        lastReviewed,
        nextReviewDate,
        reviewCount,
        easeFactor,
      ],
    );
    return result;
  } catch (error) {
    console.error("Error creating card:", error);
    return null;
  }
};

export const deleteCard = async (cardId) => {
  try {
    const result = await db.runAsync(
      `
        DELETE FROM Cards WHERE id = ?;
        `,
      [cardId],
    );
    return result;
  } catch (error) {
    console.error("Error deleting card:", error);
    return null;
  }
};
