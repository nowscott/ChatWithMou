const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const response = await axios.post('https://api.siliconflow.cn/v1/chat/completions', req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.QWEN_API_KEY}`
      },
      responseType: 'stream'
    });

    response.data.on('data', (chunk) => {
      res.write(`data: ${chunk.toString()}\n\n`);
    });

    response.data.on('end', () => {
      res.write('data: [DONE]\n\n');
      res.end();
    });
  } catch (error) {
    console.error('Error calling Qwen API:', error);
    res.write(`data: {"error": "Failed to get response from Qwen API"}\n\n`);
    res.end();
  }
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});