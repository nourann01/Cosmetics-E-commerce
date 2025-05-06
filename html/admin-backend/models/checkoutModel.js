const mongoose = require('mongoose');

const CardDetailsSchema = new mongoose.Schema({
  nameOnCard: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
    match: /^\d{16}$/,
  },
  expiry: {
    type: String,
    required: true,
    match: /^(0[1-9]|1[0-2])\/\d{2}$/,
  },
  cvc: {
    type: String,
    required: true,
    match: /^\d{3}$/,
  }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  address: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Credit Card'],
    required: true,
  },
  cardDetails: {
    type: CardDetailsSchema,
    required: function () {
      return this.paymentMethod === 'Credit Card';
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("Checkout", OrderSchema);
