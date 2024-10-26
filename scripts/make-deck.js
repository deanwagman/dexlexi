const readline = require("readline");

const OpenAI = require("openai");
const z = require("zod");
const zodResponseFormat = require("openai/helpers/zod")?.zodResponseFormat;

const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const util = require("util");

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

const deckPrompt = require("./prompts").deckPrompt;

const client = new OpenAI({
  apiKey: openaiKey,
});

// Helper function to create readline interface
const createReadlineInterface = () => {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
};

const deckShema = z.object({
  name: z.string(),
  cards: z.array(
    z.object({
      front: z.string(),
      back: z.string(),
      tags: z.array(z.string()),
    })
  ),
});

const parseResponse = (response) => response.choices[0].message.content;

const getRequest = async (rl) => {
  // Helper function to prompt questions
  const askQuestion = (query) =>
    new Promise((resolve) => rl.question(query, resolve));

  // get prompt from run arguments
  const subject = await askQuestion("What is the subject of the deck? ");
  const topic = await askQuestion("What is the name of the deck? ");
  const level = await askQuestion(
    "What is the difficulty level of the deck? (1-9) "
  );
  const numberOfCards = await askQuestion("How many cards would you like? ");

  // get model from user
  const model = "gpt-4o-mini";

  // get completion from openai
  const completion = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `
        You are creating a lexicon flashcard deck learners on the subject of ${subject}.
        The topic of the deck is ${topic}.
        You will create ${numberOfCards} cards for the deck.
        The difficulty level of the deck is ${level}.

        Please keep the front and back text concise and clear.

        The front of the card should contain a word or phrase.

        The back of the card should contain the translation or definition of the word or phrase.

        Please apply 10 tags to each card to help categorize the content.
    `,
      },
    ],
    model: model,
    response_format: zodResponseFormat(deckShema, "deck"),
  });

  // return completion
  const response = parseResponse(completion);

  try {
    const deck = await JSON.parse(response);
    return deck;
  } catch (error) {
    console.log({ error });
  } finally {
    rl.close();
  }
};

const main = async () => {
  const rl = createReadlineInterface();

  const deck = await getRequest(rl);
  const getName = (deck) =>
    `deck-${deck.name
      .toLowerCase()
      .replace(/\s/g, "-")
      .replace(/[^\w-]/g, "")}-${Date.now()}.json`;

  try {
    // write deck to json file
    const deckPath = path.join(__dirname, "..", "data", "decks", getName(deck));
    fs.writeFileSync(deckPath, JSON.stringify(deck, null, 2));
    console.log(`Deck saved to ${deckPath}`);
  } catch (error) {
    console.error(error);
  }
};

main();

// Set up the request to openai endpoint
