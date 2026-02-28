require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// 1. Initialize the app variable (THIS MUST COME FIRST)
const app = express();

// 2. Connect to MongoDB Atlas
connectDB();

// 3. Essential Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:5175', 
    'http://127.0.0.1:5173', 
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Added PATCH here
  credentials: true
}));

app.use(express.json()); 
app.use(morgan('dev'));  

// 4. Define API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/uploads', express.static('uploads'));

// 5. Default Route
app.get('/', (req, res) => {
  res.send('CitiSolve API is running successfully!');
});

// 6. Error Handling Middleware (Must be last)
app.use(errorHandler);

// 7. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});