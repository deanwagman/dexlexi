// db/index.js

import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";

import { DEFAULT_USER } from "../../constants";

const dbName = "alpha3.db";
const dbPath = `${FileSystem.documentDirectory}SQLite/alpha3.db`;
const dbDirectory = FileSystem.documentDirectory;

let dbPromise = null;

async function openDatabase() {
  const { exists } = await FileSystem.getInfoAsync(dbPath);

  console.log(
    "Database file path:",
    `${FileSystem.documentDirectory}SQLite/alpha3.db`,
  );

  if (!exists) {
    // Load the asset
    const asset = Asset.fromModule(require("../../assets/alpha3.db"));
    await asset.downloadAsync();

    // Copy the database
    await FileSystem.copyAsync({
      from: asset.localUri,
      to: dbPath,
    });
  }
  // Open and return the database
  return await SQLite.openDatabaseAsync(dbName);
}

// Initialize the database with necessary tables
async function initializeDatabase() {
  try {
    const db = await openDatabase();

    // Initialize tables
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        velocity REAL DEFAULT 1.0,
        totalWordsLearned INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0,
        lastLogin DATETIME
      );
      CREATE TABLE IF NOT EXISTS Decks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        userId INTEGER,
        progressPercentage REAL DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES Users(id)
      );
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

    const decks = await db.getAllAsync(`
      SELECT * FROM Decks;
    `);

    console.log("Decks:", decks);

    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error; // Re-throw the error to handle it in the calling code
  }
}

// Create a default user if one does not exist
async function createDefaultUserIfNotExists(db) {
  try {
    const result = await db.getFirstAsync(
      "SELECT COUNT(*) as count FROM Users WHERE username = ?",
      [DEFAULT_USER],
    );

    if (result.count === 0) {
      await db.runAsync(
        "INSERT INTO Users (username, lastLogin) VALUES (?, ?)",
        [DEFAULT_USER, new Date().toISOString()],
      );
      console.log("Default user created.");
    } else {
      console.log("Default user already exists.");
    }
  } catch (error) {
    console.error("Error checking/creating default user:", error);
  }
}

// Function to get the database instance
async function getDb() {
  if (!dbPromise) {
    dbPromise = initializeDatabase();
  }
  return dbPromise;
}

export { getDb, dbName, dbDirectory };
