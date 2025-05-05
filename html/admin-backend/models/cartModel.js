const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      },
      // Store these for quick access without needing to populate for basic cart display
      name: String,
      price: Number,
      image: String
    }
  ],
  totalAmount: {
    type: Number,
    default: 0
  },
  // When cart was last updated
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Cart", CartSchema);