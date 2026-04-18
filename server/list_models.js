require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const models = await genAI.listModels();
    console.log("Available Models:");
    console.log(JSON.stringify(models, null, 2));
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
