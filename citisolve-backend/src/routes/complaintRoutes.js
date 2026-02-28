const express = require('express');
const router = express.Router();
const multer = require('multer');

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' }); 

// 1. Import all necessary controllers
// Added 'updateStatus' to the destructuring here
const { 
  createComplaint, 
  getComplaints, 
  updateStatus 
} = require('../controllers/complaintController');

const { protect } = require('../middleware/auth');

// 2. All routes below require a valid token from localStorage
router.use(protect);

// 3. Define the Main Routes
router.route('/')
  .get(getComplaints) // Admin sees all (Citizen-only), User sees theirs
  .post(upload.single('photo'), createComplaint);

// 4. Define the Status Update Route
// This matches your AdminDashboard.jsx call: /api/complaints/:id/status
router.patch('/:id/status', updateStatus);

module.exports = router;