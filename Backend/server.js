const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
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
