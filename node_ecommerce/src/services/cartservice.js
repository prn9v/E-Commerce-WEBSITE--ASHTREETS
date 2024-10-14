const Cart = require('../models/cartmodel');
const CartItem = require('../models/cartitemsmodel');
const Product = require('../models/product');

// Function to create a new cart
async function createCart(user) {
    try {
        const cart = new Cart({ user });
        const createdCart = await cart.save();
        return createdCart;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Function to find a user's cart and calculate total price, discount, and items
async function findUserCart(userId) {
    try {
        // Find the user's cart
        let cart = await Cart.findOne({ user: userId }).populate({
            path: 'cartItems', // Populating cart items
            populate: {
                path: 'product', // Populate product details
                model: 'products' // Ensure this is the correct model name for your products
            }
        });

        if (!cart) {
            throw new Error("Cart not found for the user.");
        }

        // Initialize the totals
        let totalPrice = 0;
        let totalDiscountedPrice = 0;
        let totalItems = 0;

        // Loop through each cart item to calculate totals
        for (let cartItem of cart.cartItems) {
            // Re-fetch the cart item to ensure it reflects the latest quantity and product prices
            const latestCartItem = await CartItem.findById(cartItem._id).populate('product');

            // Check if product details are available
            if (!latestCartItem.product) {
                throw new Error("Product details are not available for item.");
            }

            // Calculate prices based on the latest data
            const itemTotalPrice = latestCartItem.product.price * latestCartItem.quantity; // Total price without discount
            const itemDiscountedPrice = latestCartItem.product.discountedPrice * latestCartItem.quantity; // Discounted total

            totalPrice += itemTotalPrice;
            totalDiscountedPrice += itemDiscountedPrice;
            totalItems += latestCartItem.quantity;
        }

        // Update the cart object with calculated values
        cart.totalPrice = totalPrice; // Total price of all items (before discount)
        cart.totalDiscountedPrice = totalDiscountedPrice; // Total after applying discounts
        cart.totalItems = totalItems; // Total number of items in the cart

        // Save the updated cart with new totals
        await cart.save();

        return cart;
    } catch (error) {
        throw new Error(error.message);
    }
}




// Function to add an item to the user's cart
async function addCartItem(userId, productId, productSize) {
    try {
        // Find the user's cart or create a new one
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create a new cart if none exists
            cart = new Cart({ user: userId, cartItems: [] });
            await cart.save();
        }

        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Product not found.");
        }

        // Check if the item already exists in the cart for the same product and size
        let cartItem = await CartItem.findOne({
            cart: cart._id,
            product: product._id,
            userId: userId,
            size: productSize // Check by size as well
        });

        if (!cartItem) {
            // If the item doesn't exist in the cart, create a new cart item
            cartItem = new CartItem({
                product: product._id,
                cart: cart._id,
                quantity: 1,
                userId: userId,
                price: product.price,
                size: productSize, // Store the size of the product
                discountedPrice: product.discountedPrice,
            });

            // Save the new cart item and update the cart
            const createdCartItem = await cartItem.save();
            cart.cartItems.push(createdCartItem._id);
            await cart.save();

            return await findUserCart(userId); // Return the updated cart after addition
        } else {
            // If the item exists, just update its quantity
            cartItem.quantity += 1;
            cartItem.price = cartItem.quantity * product.price; // Recalculate price
            cartItem.discountedPrice = cartItem.quantity * product.discountedPrice; // Recalculate discounted price
            await cartItem.save();

            return await findUserCart(userId); // Return the updated cart after updating
        }
    } catch (error) {
        console.error("Error adding item to cart:", error.message);
        throw new Error(error.message);
    }
}

module.exports = { createCart, findUserCart, addCartItem };
