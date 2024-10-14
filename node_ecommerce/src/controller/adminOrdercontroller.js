const orderService = require('../services/orderservices.js');

const getAllOrders = async(req,res) => {
    try {
        const orders = orderService.getAllOrders();
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const confirmedOrders = async(req,res) => {
    const orderId = req.params.orderId;
    try {
        const orders = orderService.confirmedOrder(orderId);
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const shippedOrders = async(req,res) => {
    const orderId = req.params.orderId;
    try {
        const orders = orderService.shippedOrder(orderId);
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const deliverOrders = async(req,res) => {
    const orderId = req.params.orderId;
    try {
        const orders = orderService.deliverOrder(orderId);
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const cancelledOrders = async(req,res) => {
    const orderId = req.params.orderId;
    try {
        const orders = orderService.cancelledOrder(orderId);
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const deleteOrders = async(req,res) => {
    const orderId = req.params.orderId;
    try {
        const orders = orderService.deleteOrder(orderId);
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

module.exports = { getAllOrders , confirmedOrders , shippedOrders , deliverOrders , cancelledOrders , deleteOrders}