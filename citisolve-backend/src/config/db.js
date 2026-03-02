// require('dotenv').config();
// const express = require('express');
// const cors = require('cors'); 
// const morgan = require('morgan');
// const connectDB = require('./config/db');
// const errorHandler = require('./middleware/errorHandler');

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Updated CORS for Production
// app.use(cors({
//   origin: [
//     'https://citisolve-s.onrender.com', 
//     'http://localhost:5173'
//   ],
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json()); 
// app.use(morgan('dev'));  

// // API Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/complaints', require('./routes/complaintRoutes'));
// app.use('/uploads', express.static('uploads'));

// // Important: Health Check for Render
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'CitiSolve API is live and connected!' });
// });

// app.use(errorHandler);

// const PORT = process.env.PORT || 10000; // Render uses 10000
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// THIS LINE IS MISSING OR WRONG - ADD IT NOW:
module.exports = connectDB;