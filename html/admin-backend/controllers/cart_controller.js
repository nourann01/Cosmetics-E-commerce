const mongoose = require('mongoose');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// Get cart for a user
exports.getCart = async (req, res) => {
  try {
    const user = req.params.id;

    if (!user) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const userId = new mongoose.Types.ObjectId(user);
    console.log("Getting cart for user:", userId);

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      console.log("No cart found, creating new cart for user:", userId);
      cart = new Cart({ user: userId, products: [], totalAmount: 0 });
      await cart.save();
      console.log("New cart created with ID:", cart._id);
    } else {
      console.log("Existing cart found with ID:", cart._id);
    }

    await cart.populate('products.product', 'name price images');

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { user, productId, quantity } = req.body;

    if (!user || !productId || typeof quantity !== "number") {
      return res.status(400).json({ message: "Missing or invalid input fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid user or product ID" });
    }

    const userId = new mongoose.Types.ObjectId(user);
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, products: [], totalAmount: 0 });
    }

    const productInCart = cart.products.find(
      item => item.product.toString() === productId
    );

    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity,
        name: product.name,
        price: product.price,
        image: product.images[0]
      });
    }

    cart.totalAmount = cart.products.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    cart.updatedAt = Date.now();

    await cart.save();

    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Cart error:", error);
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

// Update product quantity in cart
exports.updateCartItem = async (req, res) => {
  try {
    const { user, productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(item =>
      item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    cart.products[productIndex].quantity = quantity;

    cart.totalAmount = cart.products.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { user, productId } = req.body;

    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(item =>
      item.product.toString() !== productId
    );

    cart.totalAmount = cart.products.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart", error: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const { user } = req.body;

    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = [];
    cart.totalAmount = 0;

    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
};

// Decrease quantity of a product in cart
exports.decreaseCartItem = async (req, res) => {
  try {
    const { user, productId, quantity } = req.body;

    if (!user || !productId || typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ message: "Invalid input fields" });
    }

    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(item =>
      item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    cart.products[productIndex].quantity -= quantity;

    if (cart.products[productIndex].quantity <= 0) {
      cart.products.splice(productIndex, 1);
    }

    cart.totalAmount = cart.products.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    await cart.save();

    res.status(200).json({ message: "Cart item updated", cart });
  } catch (error) {
    console.error("Error decreasing cart item:", error);
    res.status(500).json({ message: "Error updating cart item", error: error.message });
  }
};
