const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
exports.createComplaint = async (req, res) => {
  try {
    const { name, ward, location, category, description } = req.body;

    if (!ward || !location || !name) {
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields.` 
      });
    }

    const complaintData = {
      user: req.user._id, 
      name,
      ward,
      location,
      category,
      description,
      photo: req.file ? req.file.path : null 
    };

    const complaint = await Complaint.create(complaintData);

    res.status(201).json({ 
      success: true, 
      message: "Complaint registered successfully",
      data: complaint 
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get complaints (Admin sees Citizens' reports, User sees only theirs)
exports.getComplaints = async (req, res) => {
  try {
    let complaints;

    if (req.user.role === 'Admin') {
      // Admin sees everything, but we populate 'user' to check roles
      complaints = await Complaint.find()
        .populate('user', 'name email role')
        .sort({ createdAt: -1 });

      // FIX: Filter so Admin only sees complaints from Citizens (excludes Admin's own tests)
      complaints = complaints.filter(c => c.user && c.user.role === 'Citizen');
      
    } else {
      // Citizens only see their own reports
      complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    }

    res.status(200).json({ 
      success: true, 
      count: complaints.length, 
      data: complaints 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch complaints" });
  }
};

// @desc    Update complaint status (NEW: Needed for Admin Dashboard)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body; // Expecting { "status": "Resolved" }

    // Validate that a status was actually sent
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true, runValidators: true } // 'new' returns the updated document
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Status updated successfully",
      data: complaint 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};