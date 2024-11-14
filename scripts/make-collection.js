const path = require("path");
const fs = require("fs");
const readline = require("readline");
const { OpenAI } = require("openai");
const z = require("zod");
const { zodResponseFormat } = require("openai/helpers/zod");

// Create a readline interface to handle user input
const createReadlineInterface = () => {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
};

// Load environment variables from the .env file
const envPath = path.join(__dirname, "..", ".env");
const env = fs.readFileSync(envPath, "utf8");

// Parse the .env file to extract key-value pairs
const envLines = env.split("\n");
const envVariables = {};
envLines.forEach((line) => {
  const [key, value] = line.split("=");
  if (key && value) {
    envVariables[key.trim()] = value.trim();
  }
});

// Extract OpenAI API key from environment variables
const openaiKey = envVariables.OPEN_AI_KEY;
if (!openaiKey) {
  console.error("Error: OPEN_AI_KEY not found in .env file");
  process.exit(1);
}

const main = async () => {
  // Initialize OpenAI client with the API key
  const client = new OpenAI({
    apiKey: openaiKey,
  });

  // Define the schema for a deck using Zod for validation
  const deckSchema = z.object({
    name: z.string(),
    description: z.string(),
    cards: z.array(
      z.object({
        front: z.string(),
        back: z.string(),
        tags: z.array(z.string()),
      }),
    ),
  });

  // Define the schema for the collection response using Zod
  const collectionSchema = z.object({
    decks: z.array(z.string()),
  });

  // Helper function to parse the response from OpenAI API
  const parseResponse = (response) => {
    if (response.choices && response.choices.length > 0) {
      let content = response.choices[0].message.content;
      // Remove code block markers if they exist
      content = content.replace(/```json\n?|```/g, "").trim();
      return JSON.parse(content);
    }
    throw new Error("Invalid response format from OpenAI API");
  };

  const getRequest = async (rl) => {
    // Helper function to prompt questions to the user
    const askQuestion = (query) =>
      new Promise((resolve) => rl.question(query, resolve));

    // Ask user for the subject of the collection and number of decks
    const subject = await askQuestion(
      "What is the subject of the collection? ",
    );
    const numberOfDecks = await askQuestion(
      "How many decks would you like to generate? ",
    );

    // Validate that the number of decks is a positive number
    if (isNaN(numberOfDecks) || Number(numberOfDecks) <= 0) {
      console.error("Error: Number of decks must be a positive number.");
      process.exit(1);
    }

    // Prompt to generate deck topics for the collection
    const collectionPrePrompt = `
      You are creating a collection of flashcards on the subject of ${subject}. 
      Each deck will have a different focus.
      The difficulty of the flashcards will vary.
      The First deck will focus on the basics of ${subject}.
      The Following decks more and more difficult.
      The User should be able to learn ${subject} from scratch using this collection.
  
      There are ${numberOfDecks} decks in this collection.

      Please list the decks and their topics as a JSON object with a "decks" key containing an array of strings.
    `;

    // Make API call to generate deck topics
    const collectionCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: collectionPrePrompt,
        },
      ],
      model: "gpt-4o-mini",
      response_format: zodResponseFormat(collectionSchema, "collection"),
    });

    console.log("Successfully generated collection prompt.");

    // Parse the response to get the deck topics
    const collectionResponse = parseResponse(collectionCompletion);
    const parsedCollection = collectionSchema.parse(collectionResponse);
    const decks = parsedCollection.decks;

    // Log the generated decks to the console
    console.log("Generated Decks:", decks);

    // Confirm with the user if they want to generate the collection
    const confirmGenerate = await askQuestion(
      "Would you like to generate the collection? (yes/no) ",
    );

    if (confirmGenerate.toLowerCase() !== "yes") {
      console.log("Exiting...");
      process.exit(0);
    }

    // Initialize the collection object to store generated decks and cards
    const collection = {
      id: `${subject}-${Date.now()}`,
      subject,
      numberOfDecks: decks.length,
      decks: [],
    };

    // Set to keep track of existing cards to avoid duplicates
    const existingCards = new Set();

    // Generate cards for each deck
    for (let i = 0; i < decks.length; i++) {
      const deckTopic = decks[i];
      const deckId = `deck-${i + 1}`;

      // Prompt to generate flashcards for each deck
      const cardsPrompt = `
        You are creating flashcards for the deck titled "${deckTopic}" on the subject of ${subject}.
        The deck should have flashcards that vary in difficulty.
        The front of each card should contain a word, phrase, or term.
        The back of the card should contain the definition of the word, phrase, or term.

        Please generate ${Math.floor(Math.random() * 10) + 5} flashcards.

        Make sure none of the generated cards are duplicates of the following existing cards:
        ${Array.from(existingCards).join(", ")}
      `;

      // Make API call to generate flashcards
      const cardsCompletion = await client.chat.completions.create({
        messages: [
          {
            role: "user",
            content: cardsPrompt,
          },
        ],
        model: "gpt-4o-mini",
        response_format: zodResponseFormat(deckSchema, "deck"),
      });

      // Parse the response to get the generated cards
      const cardsResponseText = parseResponse(cardsCompletion);

      console.log(
        `Successfully generated cards for deck: ${deckTopic}`,
        cardsResponseText,
      );

      const cardsResponse = deckSchema.parse(cardsResponseText);
      const cards = cardsResponse.cards;

      // Add the generated deck to the collection
      collection.decks.push({
        id: deckId,
        name: deckTopic,
        cards,
      });
    }

    // Save the collection to a file
    const collectionName = `collection-${subject}-${Date.now()}.json`;
    const collectionPath = path.join(
      __dirname,
      "..",
      "data",
      "collections",
      collectionName,
    );

    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
    console.log(`Collection saved to ${collectionPath}`);

    rl.close();
  };

  const rl = createReadlineInterface();

  await getRequest(rl);

  rl.close();
};

main();
