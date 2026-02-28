const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true // Removes accidental leading/trailing spaces
  },
  ward: {
    type: String,
    required: [true, "Ward number/name is required"],
    trim: true
  },
  location: {
    type: String,
    required: [true, "Specific location is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Please select a category"],
    trim: true,
    enum: [
      'Roads & Infrastructure', 
      'Water Supply', 
      'Sanitation & Waste', 
      'Street Lighting', 
      'Public Safety', 
      'Other'
    ]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [10, "Description must be at least 10 characters"],
    trim: true
  },
  photo: {
    type: String, 
    default: null
  },
  status: {
    type: String,
    required: true,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  }
}, {
  timestamps: true // Automatically creates 'createdAt' and 'updatedAt' fields
});

// Create an index for faster searching by ward or status
complaintSchema.index({ ward: 1, status: 1 });

module.exports = mongoose.model('Complaint', complaintSchema); 