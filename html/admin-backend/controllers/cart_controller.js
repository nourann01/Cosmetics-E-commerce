// const Cart = require('../models/cartModel');
// const Product = require('../models/productModel');
// const User = require('../models/userModel');

// // Get cart for a user
// // exports.getCart = async (req, res) => {
// //   try {
// //     const { user } = req.body;

// //     let cart = await Cart.findOne({ user });

// //     if (!cart) {
// //       cart = new Cart({ user, products: [], totalAmount: 0 });
// //       await cart.save();
// //     }

// //     await cart.populate('products.product', 'name price images');

// //     res.status(200).json(cart);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching cart", error: error.message });
// //   }
// // };
// exports.getCart = async (req, res) => {
//   try {
//     const user = req.params.id;

//     // Validate the user ID
//     if (!user) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(user)) {
//       return res.status(400).json({ message: "Invalid user ID format" });
//     }

//     const userId = new mongoose.Types.ObjectId(user);
//     console.log("Getting cart for user:", userId);

//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       console.log("No cart found, creating new cart for user:", userId);
//       cart = new Cart({ 
//         user: userId, 
//         products: [], 
//         totalAmount: 0 
//       });
//       await cart.save();
//       console.log("New cart created with ID:", cart._id);
//     } else {
//       console.log("Existing cart found with ID:", cart._id);
//     }

//     await cart.populate('products.product', 'name price images');

//     res.status(200).json(cart);
//   } catch (error) {
//     console.error("Error in getCart:", error);
//     res.status(500).json({ message: "Error fetching cart", error: error.message });
//   }
// };

// // Add product to cart
// exports.addToCart = async (req, res) => {
//   try {
//     const { user, productId, quantity } = req.body;

//     if (!user || !productId || typeof quantity !== "number") {
//       return res.status(400).json({ message: "Missing or invalid input fields" });
//     }

//     // Ensure ObjectId type for user and product
//     if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json({ message: "Invalid user or product ID" });
//     }

//     const userId = new mongoose.Types.ObjectId(user);

//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     if (product.stock < quantity) {
//       return res.status(400).json({ message: "Not enough stock available" });
//     }

//     // Explicitly find a cart for this specific user
//     let cart = await Cart.findOne({ user: userId });
    
//     // If no cart exists for this user, create a new one
//     if (!cart) {
//       cart = new Cart({ 
//         user: userId, 
//         products: [], 
//         totalAmount: 0 
//       });
//     }

//     const productInCart = cart.products.find(
//       item => item.product.toString() === productId
//     );

//     if (productInCart) {
//       productInCart.quantity += quantity;
//     } else {
//       cart.products.push({
//         product: productId,
//         quantity,
//         name: product.name,
//         price: product.price,
//         image: product.images[0]
//       });
//     }

//     // Recalculate total amount
//     cart.totalAmount = cart.products.reduce((total, item) => {
//       return total + item.price * item.quantity;
//     }, 0);

//     // Update the updatedAt field
//     cart.updatedAt = Date.now();

//     await cart.save();

//     res.status(200).json({ message: "Product added to cart", cart });
//   } catch (error) {
//     console.error("Cart error:", error);
//     res.status(500).json({ message: "Error adding to cart", error: error.message });
//   }
// };


// // Update product quantity in cart
// exports.updateCartItem = async (req, res) => {
//   try {
//     const { user, productId, quantity } = req.body;

//     if (quantity < 1) {
//       return res.status(400).json({ message: "Quantity must be at least 1" });
//     }

//     const cart = await Cart.findOne({ user });
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     const productIndex = cart.products.findIndex(item =>
//       item.product.toString() === productId
//     );

//     if (productIndex === -1) {
//       return res.status(404).json({ message: "Product not in cart" });
//     }

//     const product = await Product.findById(productId);
//     if (product.stock < quantity) {
//       return res.status(400).json({ message: "Not enough stock available" });
//     }

//     cart.products[productIndex].quantity = quantity;

//     cart.totalAmount = cart.products.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     await cart.save();

//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating cart", error: error.message });
//   }
// };

// // Remove product from cart
// exports.removeFromCart = async (req, res) => {
//   try {
//     const { user, productId } = req.body;

//     const cart = await Cart.findOne({ user });
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     cart.products = cart.products.filter(item =>
//       item.product.toString() !== productId
//     );

//     cart.totalAmount = cart.products.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);

//     await cart.save();

//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ message: "Error removing from cart", error: error.message });
//   }
// };

// // Clear cart
// exports.clearCart = async (req, res) => {
//   try {
//     const { user } = req.body;

//     const cart = await Cart.findOne({ user });
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     cart.products = [];
//     cart.totalAmount = 0;

//     await cart.save();

//     res.status(200).json({ message: "Cart cleared successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error clearing cart", error: error.message });
//   }
// };
const mongoose = require('mongoose');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Get cart for a user
exports.getCart = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // 2. First check raw data WITHOUT population
    const rawCart = await Cart.findOne({ user: userId }).lean();
    console.log('RAW CART DATA FROM DB:', rawCart);

    if (!rawCart) {
      const newCart = await Cart.create({ 
        user: userId, 
        products: [], 
        totalAmount: 0 
      });
      return res.status(200).json(newCart);
    }

    // 3. Verify product references exist
    const invalidProductRefs = rawCart.products.filter(
      item => !mongoose.Types.ObjectId.isValid(item.product)
    );

    if (invalidProductRefs.length > 0) {
      console.error('INVALID PRODUCT REFERENCES:', invalidProductRefs);
    }

    // 4. Check if referenced products exist in database
    const productRefs = rawCart.products.map(item => item.product);
    const existingProducts = await Product.find({ 
      _id: { $in: productRefs } 
    }).select('_id').lean();

    const missingProducts = productRefs.filter(
      id => !existingProducts.some(p => p._id.toString() === id.toString())
    );

    if (missingProducts.length > 0) {
      console.error('MISSING PRODUCTS IN DB:', missingProducts);
    }

    // 5. Now try population again with debugging
    let cart;
    try {
      cart = await Cart.findOne({ user: userId })
        .populate({
          path: 'products.product',
          select: 'name price images stock',
          model: 'Product'
        });
    } catch (populateError) {
      console.error('POPULATION ERROR:', populateError);
      throw new Error(`Population failed: ${populateError.message}`);
    }

    // 6. Final verification before sending response
    if (!cart) {
      console.error('UNEXPECTED ERROR: Cart disappeared after finding it earlier');
      return res.status(500).json({ message: "Unexpected cart retrieval error" });
    }

    // 7. Return response with debug info
    res.status(200).json({
      cart,
      debugInfo: {
        rawCartData: rawCart,
        invalidProductReferences: invalidProductRefs,
        missingProductsInDB: missingProducts,
        populatedSuccessfully: cart.products.every(item => item.product !== null)
      }
    });

  } catch (error) {
    console.error("FULL ERROR DETAILS:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date()
    });
    
    res.status(500).json({ 
      message: "Error fetching cart", 
      error: error.message,
      debugInfo: {
        allCarts: await Cart.find({}).lean(),
        allProducts: await Product.find({}).select('_id name').lean()
      }
    });
  }
};

// Add product to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Input validation
    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: "Insufficient stock", 
        availableStock: product.stock 
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, products: [], totalAmount: 0 });
    }

    const existingProductIndex = cart.products.findIndex(
      item => item.product.toString() === productId
    );

    if (existingProductIndex >= 0) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity,
        name: product.name,
        price: product.price,
        image: product.images[0]
      });
    }

    // Update total amount
    cart.totalAmount = cart.products.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );

    await cart.save();
    await cart.populate('products.product', 'name price images stock');

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

// Update product quantity in cart
exports.updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: "Not enough stock available",
        availableStock: product.stock
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      item => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    cart.products[productIndex].quantity = quantity;
    cart.totalAmount = cart.products.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );

    await cart.save();
    await cart.populate('products.product', 'name price images stock');

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
};

// Remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const { productId } = req.params;

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(
      item => item.product.toString() !== productId
    );

    if (initialLength === cart.products.length) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.totalAmount = cart.products.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );

    await cart.save();
    await cart.populate('products.product', 'name price images stock');

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart", error: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { products: [], totalAmount: 0 },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
};