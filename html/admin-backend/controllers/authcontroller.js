const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// helper to create token
const createToken = (user) => {
    return jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  };
// Register
exports.register = async (req, res) => {
  const { username, email, password, isAdmin } = req.body; // use isAdmin instead of role
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdminBoolean = (isAdmin === 'true' || isAdmin === true);
    console.log('isAdminBoolean:', isAdminBoolean);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isAdmin: isAdminBoolean 
    });

    const token = createToken(newUser);
    res
      .cookie('token', token, { httpOnly: false })
      .status(201)
      .json({ msg: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', email); // Log the received email

  try {
    // Try to find the user with the given email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ msg: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials');
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = createToken(user);

    // Set the token in cookies and send success response
    console.log("Sending response: ", { msg: 'Logged in successfully', isAdmin: user.isAdmin });
    res.cookie('token', token, { httpOnly: false, secure: false, sameSite: 'lax' }).json({ msg: 'Logged in successfully', isAdmin: user.isAdmin });
  } catch (err) {
    console.error('Error in login:', err.message);  // Log any errors that occur
    res.status(500).json({ error: err.message });
  }
};


// Logout
exports.logout = (req, res) => {
  res.clearCookie('token', {path:'/',sameSite:'lax', secure: false}).json({ msg: 'Logged out successfully' });
};
