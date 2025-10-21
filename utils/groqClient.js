// utils/groqClient.js
const axios = require('axios');


const URL = process.env.GROQ_API_URL;
const KEY = process.env.GROQ_API_KEY;


if (!KEY) console.warn('[Groq] GROQ_API_KEY not set; scan disabled');


async function analyzeTextWithGroq(text, systemPrompt = 'You are a moderator assistant. Return a JSON array of objects {id, flagged, reason}.') {
if (!KEY) throw new Error('GROQ_API_KEY missing');
const payload = {
model: 'gpt-4o-mini',
messages: [
{ role: 'system', content: systemPrompt },
{ role: 'user', content: text }
],
max_tokens: 800
};


const res = await axios.post(URL, payload, {
headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
timeout: 30000
});
return res.data;
}


module.exports = { analyzeTextWithGroq };