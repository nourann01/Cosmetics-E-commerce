const express = require("express");
const router = express.Router();
const orderController = require("../controllers/checkout_controller");


router.post("/checkout", orderController.createOrder);

module.exports = router;
