const express = require('express');
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Multer for file uploads (audio/video)
const upload = multer({ dest: 'uploads/' });

// Basic route
app.get('/', (req, res) => {
  res.send('HireMetry Backend');
});

// Endpoint to analyze text response
app.post('/analyze-text', async (req, res) => {
  const { text } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an AI interviewer analyzing candidate responses for technical skills, behavioral traits, problem-solving ability, and spontaneity. Provide feedback and suggestions.' },
        { role: 'user', content: text }
      ],
    });
    res.json({ feedback: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Placeholder for audio/video analysis
app.post('/analyze-media', upload.single('media'), async (req, res) => {
  // TODO: Implement speech-to-text and analysis
  res.json({ message: 'Media analysis not yet implemented' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});