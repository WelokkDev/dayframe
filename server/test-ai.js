// Test script for AI integration
require('dotenv').config();
const { parseTaskFromText } = require('./services/aiService');

async function testAIParsing() {
  const testInputs = [
    "Call mom every Sunday at 2pm",
    "Exercise every weekday morning",
    "Pay rent on the 1st of every month",
    "Review budget every first Friday",
    "Buy groceries tomorrow at 5pm",
    "Weekly team meeting every Monday at 9am"
  ];

  console.log('Testing AI Task Parsing...\n');

  for (const input of testInputs) {
    try {
      console.log(`Input: "${input}"`);
      const result = await parseTaskFromText(input, 1);
      console.log('Parsed Result:', JSON.stringify(result, null, 2));
      console.log('---\n');
    } catch (error) {
      console.error(`Error parsing "${input}":`, error.message);
      console.log('---\n');
    }
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY not found in environment variables');
    console.log('Please create a .env file with your OpenAI API key:');
    console.log('OPENAI_API_KEY=your_api_key_here');
    process.exit(1);
  }

  testAIParsing().catch(console.error);
}
