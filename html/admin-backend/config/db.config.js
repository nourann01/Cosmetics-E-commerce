const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO);
      console.log('MongoDB is Connected');
    } catch (err) {
      console.log('Error connecting to MongoDB:', err);
    }
  };

  module.exports = connectDB;