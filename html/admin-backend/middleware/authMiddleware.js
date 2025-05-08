const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.requireAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isAdmin) {
      req.user = user;
      return next();
    }

    if (req.params.id && req.params.id !== user._id.toString()) {
      return res.status(403).json({ error: "Access denied: You can only access your own data" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
