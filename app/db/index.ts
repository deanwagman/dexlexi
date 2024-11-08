import * as SQLite from "expo-sqlite";

// Open the database synchronously
export const db = SQLite.openDatabaseSync("alpha.db");

// Initialize the database with necessary tables
const initializeDatabase = () => {
  try {
    // Users table
    db.execSync([
      {
        sql: `
          CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            velocity REAL DEFAULT 1.0,
            totalWordsLearned INTEGER DEFAULT 0,
            streak INTEGER DEFAULT 0,
            lastLogin DATETIME
          );
        `,
        args: [],
      },
    ]);

    // Decks table
    db.execSync([
      {
        sql: `
          CREATE TABLE IF NOT EXISTS Decks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            userId INTEGER,
            totalCards INTEGER DEFAULT 0,
            cardsLearned INTEGER DEFAULT 0,
            progressPercentage REAL DEFAULT 0,
            FOREIGN KEY (userId) REFERENCES Users(id)
          );
        `,
        args: [],
      },
    ]);

    // Cards table
    db.execSync([
      {
        sql: `
          CREATE TABLE IF NOT EXISTS Cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            deckId INTEGER,
            front TEXT,
            back TEXT,
            difficulty INTEGER DEFAULT 1,
            masteryLevel INTEGER DEFAULT 0,
            lastReviewed DATETIME,
            nextReviewDate DATETIME,
            reviewCount INTEGER DEFAULT 0,
            easeFactor REAL DEFAULT 2.5,
            FOREIGN KEY (deckId) REFERENCES Decks(id)
          );
        `,
        args: [],
      },
    ]);

    // Sessions table
    db.execSync([
      {
        sql: `
          CREATE TABLE IF NOT EXISTS Sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            deckId INTEGER,
            startTime DATETIME,
            endTime DATETIME,
            totalCardsReviewed INTEGER,
            accuracyRate REAL,
            FOREIGN KEY (userId) REFERENCES Users(id),
            FOREIGN KEY (deckId) REFERENCES Decks(id)
          );
        `,
        args: [],
      },
    ]);

    // SessionCards table
    db.execSync([
      {
        sql: `
          CREATE TABLE IF NOT EXISTS SessionCards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sessionId INTEGER,
            cardId INTEGER,
            quality INTEGER,
            responseTime INTEGER,
            FOREIGN KEY (sessionId) REFERENCES Sessions(id),
            FOREIGN KEY (cardId) REFERENCES Cards(id)
          );
        `,
        args: [],
      },
    ]);
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Call this to set up the database when the app starts
initializeDatabase();

// CRUD functions
const addUser = (username) => {
  try {
    const result = db.runSync("INSERT INTO Users (username) VALUES (?);", [
      username,
    ]);
    console.log("User added with ID:", result.lastInsertRowId);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

const getUserById = (id) => {
  try {
    const user = db.getFirstSync("SELECT * FROM Users WHERE id = ?;", [id]);
    if (user) {
      console.log("User:", user);
      return user;
    } else {
      console.log("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    return null;
  }
};

const getAllUsers = () => {
  try {
    const users = db.getAllSync("SELECT * FROM Users;");
    users.forEach((user) => console.log("User:", user));
    return users;
  } catch (error) {
    console.error("Error retrieving users:", error);
    return [];
  }
};

const updateUser = (id, newUsername) => {
  try {
    const result = db.runSync("UPDATE Users SET username = ? WHERE id = ?;", [
      newUsername,
      id,
    ]);
    console.log("Rows affected:", result.changes);
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const deleteUser = (id) => {
  try {
    const result = db.runSync("DELETE FROM Users WHERE id = ?;", [id]);
    console.log("Rows deleted:", result.changes);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

// Export CRUD functions for use in other parts of the app
export { addUser, getUserById, getAllUsers, updateUser, deleteUser };
