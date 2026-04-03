const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'https://blessingg-bridge.vercel.app',
    'http://localhost:3000', // for local development
    process.env.FRONTEND_URL // allow via environment variable
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Body parser for JSON

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));

app.get('/', (req, res) => {
    res.send('BlessingBridge API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
