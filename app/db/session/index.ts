import { db } from "../index";

/* Session table
id INTEGER PRIMARY KEY AUTOINCREMENT,
userId INTEGER,
deckId INTEGER,
startTime DATETIME,
endTime DATETIME,
totalCardsReviewed INTEGER,
accuracyRate REAL,
FOREIGN KEY (userId) REFERENCES Users(id),
FOREIGN KEY (deckId) REFERENCES Decks(id)

// SessionCards table
id INTEGER PRIMARY KEY AUTOINCREMENT,
sessionId INTEGER,
cardId INTEGER,
quality INTEGER,
responseTime INTEGER,
FOREIGN KEY (sessionId) REFERENCES Sessions(id),
FOREIGN KEY (cardId) REFERENCES Cards(id)
*/

export const startSession = async (userId, deckId, startTime) => {
  try {
    const result = await db.runAsync(
      `
        INSERT INTO Sessions (userId, deckId, startTime)
        VALUES (?, ?, ?);
        `,
      [userId, deckId, startTime],
    );
    const id = result.lastInsertRowId;

    console.log("Session started with ID:", id);

    return id;
  } catch (error) {
    console.error("Error starting session:", error);
    return null;
  }
};

export const updateSession = async (
  sessionId,
  totalCardsReviewed,
  accuracyRate,
) => {
  try {
    const result = await db.runAsync(
      `
            UPDATE Sessions
            SET totalCardsReviewed = ?, accuracyRate = ?
            WHERE id = ?;
            `,
      [totalCardsReviewed, accuracyRate, sessionId],
    );
    console.log("Session updated with ID:", sessionId);

    return result;
  } catch (error) {
    console.error("Error updating session:", error);
  }
};

export const endSession = async (
  sessionId,
  endTime,
  totalCardsReviewed,
  accuracyRate,
) => {
  console.log({ sessionId, endTime, totalCardsReviewed, accuracyRate });
  try {
    const result = await db.runAsync(
      `
        UPDATE Sessions
        SET endTime = ?, totalCardsReviewed = ?, accuracyRate = ?
        WHERE id = ?;
        `,
      [endTime, totalCardsReviewed, accuracyRate, sessionId],
    );
    console.log("Session ended with ID:", sessionId);

    return result;
  } catch (error) {
    console.error("Error ending session:", error);
  }
};

export const recordSessionCard = async (
  sessionId,
  cardId,
  quality,
  responseTime,
) => {
  try {
    const result = await db.runAsync(
      `
            INSERT INTO SessionCards (sessionId, cardId, quality, responseTime)
            VALUES (?, ?, ?, ?);
            `,
      [sessionId, cardId, quality, responseTime],
    );

    return result;
  } catch (error) {
    console.error("Error recording session card:", error);
  }
};
