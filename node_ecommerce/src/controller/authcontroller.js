const userService = require('../services/userservice.js');
const jwtProvider = require('../config/jwtProvider.js');
const bcrypt = require('bcrypt');
const cartService = require('../services/cartservice.js');

const register = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const user = await userService.createUser(req.body);
        console.log("Created user:", user);

        const jwt = jwtProvider.generateToken(user._id);
        console.log("Generated JWT:", jwt);

        await cartService.createCart(user);
        console.log("Cart created for user");

        return res.status(200).send({ jwt, message: "Register success" });
    } catch (error) {
        console.error("Error in register:", error);
        return res.status(500).send({ error: error.message });
    }
};

const login = async(req, res) => {
    const { password, email } = req.body;

    try {
        const user = await userService.findUserByEmail(email);

        if (!user) {
            return res.status(404).send({ message: `User not found with email: ${email}` });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(404).send({ message: "Invalid Password..." });
        }

        const jwt = jwtProvider.generateToken(user._id);
        return res.status(200).send({ jwt, message: "Login Success" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

module.exports = { register, login };