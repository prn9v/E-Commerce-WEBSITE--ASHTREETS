const Address = require("../models/addressmodel.js");
const OrderItem = require("../models/orderItems.js");
const Order = require("../models/ordermodel.js");
const cartService = require("../services/cartservice.js");

const createOrder = async (user, shipAddress) => {
    try {
        let address;
        console.log("Received Shipping Address: ", shipAddress);

        // Validate if shipAddress is provided
        if (!shipAddress) {
            throw new Error("Shipping address is missing.");
        }

        // Check if the shipping address has an existing _id
        if (shipAddress._id) {
            const existAddress = await Address.findById(shipAddress._id);
            if (!existAddress) {
                throw new Error("Address not found.");
            }
            address = existAddress;
        } else {
            address = new Address(shipAddress);
            address.user = user._id;
            await address.save();

            if (!user.address.includes(address._id)) {
                user.address.push(address._id);
                await user.save();
            }
        }

        console.log("Shipping Address is:", address);

        // Get the user's cart
        const cart = await cartService.findUserCart(user._id);
        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            throw new Error("Cart is empty.");
        }

        console.log("Cart Items: ", cart.cartItems);

        const orderItems = [];

        for (const item of cart.cartItems) {
            // Log current cart item
            console.log("Current Cart Item: ", item);
            console.log("Product Details: ", item.product); // Ensure this is populated

            // Ensure the product has the required fields
            if (!item.product || !item.product.price || !item.product.discountedPrice) {
                throw new Error("Product information is incomplete.");
            }

            // Create order items based on the cart items
            const orderItem = new OrderItem({
                price: item.product.price, // Use product's price
                product: item.product._id, // Reference to the product
                quantity: item.quantity,
                size: item.size,
                userId: user._id,
                discountedPrice: item.product.discountedPrice, // Use product's discounted price
            });

            const createdOrderItem = await orderItem.save();
            orderItems.push(createdOrderItem._id);
        }

        console.log("Order Items are: ", orderItems);

        // Create the order with the collected order items and shipping address
        const createdOrder = new Order({
            user: user._id,
            orderItems,
            totalPrice: cart.totalPrice,
            totalDiscountedPrice: cart.totalDiscountedPrice,
            discount: cart.discount,
            totalItems: cart.totalItems,
            shippingAddress: address._id, // Use the address ID
        });

        const savedOrder = await createdOrder.save();
        console.log("Saved Order: ", savedOrder);
        return savedOrder;
    } catch (error) {
        console.error("Error in createOrder: ", error.message);
        throw new Error("Order creation failed. " + error.message);
    }
};


async function placedOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "PLACED";
  order.paymentDetails.paymentStatus = "COMPLETED";

  return await order.save();
}

async function confirmedOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "CONFIRMED";

  return await order.save();
}

async function shippedOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "SHIPPED";

  return await order.save();
}

async function deliverOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "DELIVERED";

  return await order.save();
}

async function cancelledOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "CANCELLED";

  return await order.save();
}

async function findOrderById(orderId) {
  const order = await Order.findById(orderId)
    .populate("user")
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("shippingAddress");

  return order;
}

async function userOrdersHistory(userId) {
  try {
    const orders = await Order.find({ user: userId, orderStatus: "PLACED" })
      .populate({ path: "orderItems", populate: { path: "product" } })
      .lean();

    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllOrders() {
  return await Order.find()
    .populate({ path: "orderItems", populate: { path: "product" } })
    .lean();
}

async function deleteOrder(orderId) {
  const order = await findOrderById(orderId);
  await Order.findByIdAndDelete(order._id);
}

module.exports = {
  createOrder,
  placedOrder,
  confirmedOrder,
  shippedOrder,
  deliverOrder,
  cancelledOrder,
  findOrderById,
  userOrdersHistory,
  getAllOrders,
  deleteOrder,
};
