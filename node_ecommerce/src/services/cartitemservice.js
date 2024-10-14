const userService = require('../services/userservice.js');
const CartItem = require('../models/cartitemsmodel.js');

async function updateCartItem(userId, cartItemId, cartItemData) {
    try {
        // Fetch the cart item by ID
        const item = await findCartItemById(cartItemId); 

        if (!item) {
            throw new Error(`Cart item with ID: ${cartItemId} not found`);
        }

        // Fetch the user to ensure the operation is authorized
        const user = await userService.findUserById(userId); 
        if (!user) {
            throw new Error(`User with ID: ${userId} not found`);
        }

        // Check if the logged-in user is allowed to update the cart item
        if (user._id.toString() !== item.userId.toString()) {
            throw new Error("You are not authorized to update this cart item");
        }

        // Update the quantity and prices based on the product's price
        item.quantity = cartItemData.quantity;
        item.price = item.quantity * item.product.price;
        item.discountedPrice = item.quantity * item.product.discountedPrice;

        // Save the updated cart item
        const updatedCartItem = await item.save();

        // Return the updated cart item
        return updatedCartItem;
    } catch (error) {
        // Catch and rethrow any errors encountered during the process
        throw new Error(error.message);
    }
}

async function removeCartItem(userId,cartItemId) {
    const cartItem = await findCartItemById(cartItemId);
    const user = await userService.findUserById(cartItem.userId);

    if(user._id.toString() === userId.toString()){
        return await CartItem.findByIdAndDelete(cartItemId);
    }

    throw new Error("You can't remove another user's item");
}

async function findCartItemById(cartItemId) {
    const cartItem = CartItem.findById(cartItemId).populate("product");

    if(cartItem){
        return cartItem
    }else{
        throw new Error("CartItem not found with the id: ",cartItemId);
    }
}

module.exports = { updateCartItem , removeCartItem , findCartItemById};