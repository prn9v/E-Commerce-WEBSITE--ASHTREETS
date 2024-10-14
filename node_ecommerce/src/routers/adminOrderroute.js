const express = require('express');
const router = express.Router();

const orderController = require('../controller/adminOrdercontroller.js');
const authenticate = require('../middleware/authenticate.js');

router.get('/',authenticate,orderController.getAllOrders);
router.put('/:orderId/confirmed',authenticate,orderController.confirmedOrders);
router.put('/:orderId/shipped',authenticate,orderController.shippedOrders);
router.put('/:orderId/deliver',authenticate,orderController.deliverOrders);
router.put('/:orderId/delete',authenticate,orderController.deleteOrders);
router.put('/:orderId/cancel',authenticate,orderController.cancelledOrders);

module.exports = router;