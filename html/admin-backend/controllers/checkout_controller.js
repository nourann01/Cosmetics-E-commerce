const Checkout = require("../models/checkoutModel");
const User = require("../models/userModel");

// Create Order Controller
exports.createOrder = async (req, res) => {
  const { fullName, email, address, paymentMethod, cardDetails } = req.body;

  try {
    // Step 1: Check if user exists
    const user = await User.findOne({ username: fullName });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    // Step 2: Create order object
    const orderData = {
      fullName,
      email,
      address,
      paymentMethod,
    };

    // Include card details if needed
    if (paymentMethod === "Credit Card") {
      orderData.cardDetails = cardDetails;
    }

    // Step 3: Save order
    const newOrder = new Checkout(orderData); // use Checkout, not Order
    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
