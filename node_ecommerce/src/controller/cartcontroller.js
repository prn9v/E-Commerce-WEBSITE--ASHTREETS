const cartService = require('../services/cartservice.js');

const findUserCart = async(req,res) => {
    const user = await req.user;
    try {
        const cart = await cartService.findUserCart(user._id);
        return res.status(200).send(cart);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

const addItemToCart = async (req, res) => {
    const user = await req.user;
    console.log("user is:",user);
    try {
        // Destructure productId and size from the request body
        const { productId, size } = req.body; 


        console.log("productId:", productId);
        console.log("productSize:", size);

        // Add the item to the user's cart by calling the service function
        const cart = await cartService.addCartItem(user._id, productId, size);

        // Respond with the updated cart
        console.log("Cart is:", cart);
        return res.status(200).send(cart);
        
    } catch (error) {
        console.log("Error adding item to cart:", error.message);
        return res.status(500).send({ error: error.message });
    }
};


module.exports = { findUserCart , addItemToCart };