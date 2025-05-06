const express = require('express');
//const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config.js');

const userRoutes = require('./routes/user_route.js');
const productRoutes = require('./routes/productRoute.js');
const cartRoutes = require('./routes/cart_route.js'); 
const CheckoutRoutes = require('./routes/checkout_route.js'); 


const app = express();
const PORT = 3000;
dotenv.config();
connectDB();

app.use(cors()); // Allow frontend access
//app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api', userRoutes); //test purpose
app.use('/api', productRoutes); //test purpose
app.use('/api/cart', cartRoutes); //test purpose
app.use('/api', CheckoutRoutes); 


// // Sample in-memory "database"
// let products = [
//   { id: 1, name: "Lipstick", description: "Red", price: 19.99, stock: 5 },
//   { id: 2, name: "Eyeshadow", description: "12 shades", price: 29.99, stock: 15 }
// ];

// // Get all products
// app.get('/api/products', (req, res) => {
//   res.json(products);
// });

// // Add new product
// app.post('/api/products', (req, res) => {
//   const product = { id: Date.now(), ...req.body };
//   products.push(product);
//   res.status(201).json(product);
// });

// // Delete product
// app.delete('/api/products/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   products = products.filter(p => p.id !== id);
//   res.status(204).end();
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Admin backend running on http://localhost:${PORT}`);
});
