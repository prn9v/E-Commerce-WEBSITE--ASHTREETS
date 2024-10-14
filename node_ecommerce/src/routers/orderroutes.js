const express = require('express');
const router = express.Router();

const orderController = require('../controller/ordercontroller.js');
const authenticate = require('../middleware/authenticate.js');

router.post("/", authenticate, orderController.createOrder);
router.get("/user",authenticate,orderController.orderHistory);
router.get("/:id",authenticate,orderController.findOrderById);
router.get("/get",authenticate,orderController.getAllOrders);

module.exports = router;