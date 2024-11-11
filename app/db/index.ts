import * as SQLite from "expo-sqlite";

import { DEFAULT_USER } from "../../constants";

// Open the database asynchronously
const openDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("alpha.db");
    return db;
  } catch (error) {
    console.error("Error opening database:", error);
    throw error;
  }
};

// Initialize the database with necessary tables
const initializeDatabase = async () => {
  try {
    const db = await openDatabase();

    // Users table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        velocity REAL DEFAULT 1.0,
        totalWordsLearned INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0,
        lastLogin DATETIME
      );
    `);

    // Decks table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Decks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        userId INTEGER,
        totalCards INTEGER DEFAULT 0,
        cardsLearned INTEGER DEFAULT 0,
        progressPercentage REAL DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES Users(id)
      );
    `);

    // Cards table
    await db.execAsync(`
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
    `);

    // Sessions table
    await db.execAsync(`
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
    `);

    // SessionCards table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS SessionCards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sessionId INTEGER,
        cardId INTEGER,
        quality INTEGER,
        responseTime INTEGER,
        FOREIGN KEY (sessionId) REFERENCES Sessions(id),
        FOREIGN KEY (cardId) REFERENCES Cards(id)
      );
    `);

    console.log("Database initialized successfully.");

    await createDefaultUserIfNotExists(db);

    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Create a default user if one does not exist
const createDefaultUserIfNotExists = async (db) => {
  try {
    const [{ userCount }] = await db.getAllAsync(
      `SELECT COUNT(*) AS userCount FROM Users`,
    );

    if (userCount === 0) {
      await db.runAsync(
        `INSERT INTO Users (username, lastLogin) VALUES (?, ?)`,
        [DEFAULT_USER, new Date().toISOString()],
      );
      console.log("Default user created.");
    } else {
      console.log("Default user already exists.");
    }
  } catch (error) {
    console.error("Error checking/creating default user:", error);
  }
};

initializeDatabase();

// Call the initializeDatabase function
export const db = SQLite.openDatabaseSync("alpha.db");
