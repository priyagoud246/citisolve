const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes (Check if user is logged in)
exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in headers (Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    // 2. Verify the token using your JWT_SECRET from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach the user object to the request (so we know who is complaining)
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Middleware to restrict access to Admins only
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};