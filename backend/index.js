const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows requests from frontend (for local testing)
app.use(express.json());

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API endpoint to handle questions
app.post('/api/ask', async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required.' });
        }
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        const result = await model.generateContent(question);
        const response = await result.response;
        const text = response.text();

        res.json({ answer: text });

    } catch (error) {
        console.error("Error in /api/ask:", error);
        res.status(500).json({ error: 'Failed to get a response from AI.' });
    }
});

// Start the server for local testing
if (process.env.NODE_ENV !== 'test') { // Ensure the server only runs locally
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}


// Export the app for Vercel's serverless environment
module.exports = app;