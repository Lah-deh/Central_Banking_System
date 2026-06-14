require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateAdvice(financialData) {

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
You are a smart financial advisor.

Analyze this financial data:

${JSON.stringify(financialData, null, 2)}

Return:
1. Spending insight
2. Risk level (low, medium, high)
3. 3 practical budgeting recommendations

Be concise and clear.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

module.exports = { generateAdvice };