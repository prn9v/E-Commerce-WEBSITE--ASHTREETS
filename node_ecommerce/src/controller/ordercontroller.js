const orderService = require('../services/orderservices.js');

const createOrder = async (req, res) => {
    const user = await req.user; // Get the authenticated user
    try {
        const shippingAddress = req.body.address; // Extract the address from the body
        let createdOrder = await orderService.createOrder(user, shippingAddress); // Pass the address to the service
        console.log(createOrder);
        return res.status(200).send(createdOrder);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};


const findOrderById = async(req,res) => {
    const user = await req.user;
    try {
        let createdOrder = await orderService.findOrderById(req.params.id);
        return res.status(200).send(createdOrder);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const orderHistory = async(req,res) => {
    const user = await req.user;
    try {
        let createdOrder = await orderService.userOrdersHistory(user._id);
        return res.status(200).send(createdOrder);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const getAllOrders = async (req, res) => {
    try {
        let allOrders = await orderService.getAllOrders(); 
        console.log("All orders are: ",allOrders)
        return res.status(200).send(allOrders);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

module.exports = { createOrder, findOrderById , orderHistory , getAllOrders};