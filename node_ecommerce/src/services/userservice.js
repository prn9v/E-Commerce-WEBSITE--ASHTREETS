const User = require('../models/usermodel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwtProvider = require('../config/jwtProvider.js');

const createUser = async(userData) => {
    try {
        let { firstName, lastName, email, password } = userData;

        // Ensure connection is established before proceeding
        if (mongoose.connection.readyState !== 1) {
            throw new Error('MongoDB is not connected');
        }

        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            throw new Error(`User already exists with this email: ${email}`);
        }

        password = await bcrypt.hash(password, 8);

        const user = await User.create({ firstName, lastName, email, password });

        console.log("User created:", user);

        return user;
    } catch (error) {
        console.error("Error in createUser:", error);
        throw new Error(error.message);
    }
}

const findUserById = async(userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error(`User not found with id: ${userId}`);
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}

const findUserByEmail = async(email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error(`User not found with email: ${email}`);
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getUserProfileByToken = async(token) => {
    const userId = jwtProvider.getUserIdByToken(token);
    const user = await findUserById(userId);
    return user;
}

const getAllUsers = async() => {
    try {
        const users = await User.find();
        return users; 
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { createUser, findUserById, findUserByEmail, getUserProfileByToken, getAllUsers };
