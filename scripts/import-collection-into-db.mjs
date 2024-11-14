import path from "path";
import fs from "fs";
import readline from "readline";
import sqlite3 from "sqlite3";
import { DEFAULT_USER } from "../constants/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Open the database
const db = new sqlite3.Database("alpha.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    throw err;
  }
});

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
  const files = fs.readdirSync(path.join(__dirname, "..", "data", "collections"));

  if (files.length === 0) {
    rl.close();
    throw new Error("No files found in the directory.");
  }

  console.log("Available files:");
  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });

  const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));
  const fileIndex = await askQuestion("Select a file by entering the number: ");
  rl.close();

  const selectedFile = files[parseInt(fileIndex) - 1];
  if (!selectedFile) {
    throw new Error("Invalid selection. Please run the script again and select a valid file.");
  }

  return path.join(__dirname, "..", "data", "collections", selectedFile);
};

// Function to import decks and cards into the database
const importCollectionToDatabase = async (collection) => {
  try {
    // Get the userId of the DEFAULT_USER by querying the username
    db.get(`SELECT id FROM Users WHERE username = ?;`, [DEFAULT_USER], (err, row) => {
      if (err) {
        throw new Error(`Error querying DEFAULT_USER: ${err.message}`);
      }

      if (!row) {
        throw new Error("DEFAULT_USER not found in the database.");
      }

      const userId = row.id;

      // Iterate over each deck in the collection
      collection.decks.forEach((deck) => {
        db.run(
          `INSERT INTO Decks (name, userId) VALUES (?, ?);`,
          [deck.name, userId],
          function (err) {
            if (err) {
              throw new Error(`Failed to insert deck: ${deck.name}, ${err.message}`);
            }

            const deckId = this.lastID;

            // Iterate over each card in the deck and insert into Cards table
            deck.cards.forEach((card) => {
              db.run(
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
                ],
                (err) => {
                  if (err) {
                    console.error(`Failed to insert card: ${card.front}, ${err.message}`);
                  }
                }
              );
            });
          }
        );
      });
    });
    console.log("Collection imported to database successfully.");
  } catch (error) {
    console.error("Error importing collection to database:", error);
  }
};

// Main function to run the import process
const main = async () => {
  try {
    const collectionPath = await selectFileFromDirectory();
    const collection = JSON.parse(fs.readFileSync(collectionPath, "utf8"));
    await importCollectionToDatabase(collection);
  } catch (error) {
    console.error("Error during the import process:", error);
  }
};

// Run the main function
main();
