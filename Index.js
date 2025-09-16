const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const TELE_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || process.env.CHAT_ID;
const PORT = process.env.PORT || 10000;

if (!TELE_TOKEN || !CHAT_ID) {
  console.error("Set TELEGRAM_TOKEN and TELEGRAM_CHAT_ID as environment variables.");
}

const app = express();
app.use(bodyParser.json());

app.post('/moralis', async (req, res) => {
  try {
    console.log('Moralis event received:', JSON.stringify(req.body).slice(0, 1000));
    // Customize message text however you like
    const msg = `🚀 New on-chain event:\n<pre>${JSON.stringify(req.body, null, 2).slice(0,2000)}</pre>`;
    await axios.post(`https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: msg,
      parse_mode: 'HTML'
    });
    return res.sendStatus(200);
  } catch (err) {
    console.error('Error handling webhook:', err?.message || err);
    return res.status(500).send('error');
  }
});

app.get('/', (req, res) => res.send('OK - webhook live'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
