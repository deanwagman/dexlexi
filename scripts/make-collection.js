// Uses OpenAI Http API to generate a collection of flashcards based on a given prompt.
// numberOfCards: The number of flashcards to generate.
// numberOfCardsVariation: The variation in the number of cards to generate.
// collectionPrompt: The prompt to generate the collection of flashcards.

// Writes the generated flashcards to a file.

const path = require("path");
const fs = require("fs");
const readline = require("readline");
const { OpenAI } = require("openai");
const z = require("zod");
const { zodResponseFormat } = require("openai/helpers/zod");

// const AVERAGE_DECK_SIZE = 20;
// const DECK_SIZE_VARIATION = 10;
// const getSize = () =>
//   Math.floor(Math.random() * DECK_SIZE_VARIATION) + AVERAGE_DECK_SIZE;

// Helper function to create readline interface
const createReadlineInterface = () => {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
};

// Read the .env file
const envPath = path.join(__dirname, "..", ".env");
const env = fs.readFileSync(envPath, "utf8");

// Parse the .env file
const envLines = env.split("\n");
const envVariables = {};
envLines.forEach((line) => {
  const [key, value] = line.split("=");
  envVariables[key] = value;
});

// Get the openai key from the .env file
const openaiKey = envVariables.OPEN_AI_KEY;

const main = async () => {
  const client = new OpenAI({
    apiKey: openaiKey,
  });

  const deckShema = z.object({
    id: z.string(),
    name: z.string(),
    cards: z.array(
      z.object({
        id: z.string(),
        front: z.string(),
        back: z.string(),
        tags: z.array(z.string()),
      }),
    ),
  });

  const collectionShema = z.object({
    id: z.string(),
    subject: z.string(),
    numberOfDecks: z.number(),
    decks: z.array(deckShema),
  });

  const parseResponse = (response) => response.choices[0].message.content;

  const getRequest = async (rl) => {
    // Helper function to prompt questions
    const askQuestion = (query) =>
      new Promise((resolve) => rl.question(query, resolve));

    // get prompt from run arguments
    const subject = await askQuestion(
      "What is the subject of the collection? ",
    );
    const numberOfDecks = await askQuestion(
      "How many decks would you like to generate? ",
    );

    const collectionPrePrompt = `
        You are creating a collection of flashcards on the subject of ${subject}. 
        Each deck will have a different focus.
        The difficulty of the flashcards will vary.
        The First deck will focus on the basics of ${subject}.
        The Following decks more and more difficult.
        The User should be able to learn ${subject} from scratch using this collection.
    
        There are ${numberOfDecks} decks in this collection.

        Please list the decks and their topics.
        `;

    const collectionCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: collectionPrePrompt,
        },
      ],
      model: "gpt-4o-mini",
    });

    console.log("Successfully generated collection prompt.");

    const collectionResponseText = parseResponse(collectionCompletion);

    console.log(collectionResponseText);

    const confirmGenerate = await askQuestion(
      "Would you like to generate the collection? (yes/no) ",
    );

    if (confirmGenerate.toLowerCase() !== "yes") {
      console.log("Exiting...");
      process.exit(0);
    }

    const decksPrompt = `
        You are creating a collection of flashcards on the subject of ${subject}.
        Each deck will have a different focus.
        The difficulty of the flashcards will vary.
        The First deck will focus on the basics of ${subject}.
        The Following decks more and more difficult.
        The User should be able to learn ${subject} from scratch using this collection.

        There are ${numberOfDecks} decks in this collection.

        Please make the front of the card that contains a word or phrase or term.
        The back of the card should contain the definition of the word or phrase or term.

        Here are the decks and their names:
        ${collectionResponseText}
        `;

    const decksCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: decksPrompt,
        },
      ],
      model: "gpt-4o-mini",
      response_format: zodResponseFormat(collectionShema, "collection"),
    });

    const decksResponseText = parseResponse(decksCompletion);

    // write to collection file
    const collection = JSON.parse(decksResponseText);
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
