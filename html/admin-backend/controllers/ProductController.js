const Product = require('../models/productModel');
 
// 1. getAllProducts - Fetch all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    // res.json(products);
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
 
// 2. getProductById - Fetch a product by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
};
 
// 3. createProduct - Add a new product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
 
    if (!name || !description || !price || !category || !images) {
      return res.status(400).send('All fields are required');
    }
 
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      images,
    });
 
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
 
// 4. updateProduct - Update an existing product
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated doc
    );
    if (!updatedProduct) return res.status(404).send('Product not found');
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID or update failed' });
  }
};
 
// 5. deleteProduct - Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).send('Product not found');
    res.status(204).send(); // no content
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
};