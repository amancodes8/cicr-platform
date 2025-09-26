const fetch = require('node-fetch');
const { GEMINI_API_KEY, GEMINI_ENDPOINT } = process.env;

/**
 * summarizeText - sends request to Gemini (placeholder)
 * @param {string} text
 * @param {Object} options
 */
async function summarizeText(text, options = { length: 'short' }) {
  if (!GEMINI_API_KEY || !GEMINI_ENDPOINT) {
    throw new Error('Gemini API keys/endpoint not configured in env');
  }

  // NOTE: Replace the below with the actual Gemini REST API shape.
  // This is a placeholder POST shape. Real usage requires adapting to Gemini's documented request body.
  const prompt = `Summarize the following content (${options.length}):\n\n${text}`;

  const res = await fetch(`${GEMINI_ENDPOINT}/summarize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GEMINI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error: ${errText}`);
  }
  const data = await res.json();
  // Expect data.summary or similar - adapt to actual structure
  return data;
}

module.exports = {
  summarizeText
};
