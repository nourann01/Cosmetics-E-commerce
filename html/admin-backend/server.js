const express = require('express');
//const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config.js');

const userRoutes = require('./routes/user_route.js'); 
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;
dotenv.config();
connectDB();

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
})); // Allow frontend access
app.use(cookieParser());
//app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api/auth',authRoutes);
app.use('/api', userRoutes); //test purpose

// Start the server
app.listen(PORT, () => {
  console.log(`Admin backend running on http://localhost:${PORT}`);
});
