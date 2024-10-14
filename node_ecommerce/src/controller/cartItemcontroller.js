const cartItemService = require('../services/cartitemservice.js');

const updateCartItem = async (req, res) => {
    try {
        // Fetch the user from the request, assuming user authentication middleware adds it to the request object
        const user = await req.user; 

        // Use the service to update the cart item
        const updatedCartItem = await cartItemService.updateCartItem(user._id, req.params.id, req.body);

        // Respond with the updated cart item
        return res.status(200).send(updatedCartItem);
    } catch (error) {
        // Catch any error and send an appropriate error message with a 500 status code
        return res.status(500).send({ error: error.message });
    }
};

const removeCartItem = async(req,res) => {
    const user = await req.user;
    try {
        await cartItemService.removeCartItem(user._id,req.params.id);
        return res.status(200).send({message: "Cart Item Removed Successfully "});
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

module.exports = { updateCartItem , removeCartItem };