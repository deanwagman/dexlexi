import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import readline from 'readline';
import sqlite3 from 'sqlite3';

// import { DEFAULT_USER } from '../constants/index.js';
const DEFAULT_USER = 'default';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the existing database in the assets folder
const dbPath = path.join(__dirname, '..', 'assets', 'alpha2.db');

// Check if the database file exists
if (!fs.existsSync(dbPath)) {
  console.error('Database file does not exist at:', dbPath);
  process.exit(1);
}

// Open the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    throw err;
  }
  console.log('Database opened successfully.');
});

// Promisify db methods for async/await
const runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const getAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, function (err, row) {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
};

// Create a readline interface to handle user input
const createReadlineInterface = () => {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
};

// Function to let the user select a file from the directory
const selectFileFromDirectory = async () => {
  const rl = createReadlineInterface();
  const filesDir = path.join(__dirname, '..', 'data', 'collections');
  const files = fs.readdirSync(filesDir);

  if (files.length === 0) {
    rl.close();
    throw new Error('No files found in the directory.');
  }

  console.log('Available files:');
  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });

  const askQuestion = (query) =>
    new Promise((resolve) => rl.question(query, resolve));
  const fileIndex = await askQuestion('Select a file by entering the number: ');
  rl.close();

  const selectedFile = files[parseInt(fileIndex) - 1];
  if (!selectedFile) {
    throw new Error(
      'Invalid selection. Please run the script again and select a valid file.'
    );
  }

  return path.join(filesDir, selectedFile);
};

// Function to import decks and cards into the database
const importCollectionToDatabase = async (collection) => {
  try {
    // Begin transaction
    await runAsync('BEGIN TRANSACTION');

    // Get the userId of the DEFAULT_USER by querying the username
    let row = await getAsync(
      `SELECT id FROM Users WHERE username = ?;`,
      [DEFAULT_USER]
    );

    // IF the DEFAULT_USER is not found, insert it into the Users table
    if (!row) {
      const result = await runAsync(
        `INSERT INTO Users (username) VALUES (?);`,
        [DEFAULT_USER]
      );
      row = { id: result.lastID };
    }

    const userId = row.id;

    // Iterate over each deck in the collection
    for (const deck of collection.decks) {
      const result = await runAsync(
        `INSERT INTO Decks (name, userId) VALUES (?, ?);`,
        [deck.name, userId]
      );

      const deckId = result.lastID;

      // Iterate over each card in the deck and insert into Cards table
      for (const card of deck.cards) {
        await runAsync(
          `INSERT INTO Cards (deckId, front, back, difficulty, masteryLevel, lastReviewed, nextReviewDate, reviewCount, easeFactor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            deckId,
            card.front,
            card.back,
            1, // difficulty (default value)
            0, // masteryLevel (default value)
            null, // lastReviewed (default value)
            null, // nextReviewDate (default value)
            0, // reviewCount (default value)
            2.5, // easeFactor (default value)
          ]
        );
      }
    }

    // Commit transaction
    await runAsync('COMMIT');
    console.log('Collection imported to database successfully.');
  } catch (error) {
    // Rollback transaction in case of error
    await runAsync('ROLLBACK');
    console.error('Error importing collection to database:', error.message);
    throw error;
  }
};

// Main function to run the import process
const main = async () => {
  try {
    const collectionPath = await selectFileFromDirectory();
    const collectionData = await fsPromises.readFile(collectionPath, 'utf8');
    const collection = JSON.parse(collectionData);
    await importCollectionToDatabase(collection);
  } catch (error) {
    console.error('Error during the import process:', error.message);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('Error closing the database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
};

// Run the main function
main();
