import logger from "../.././../logger.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            const token = generateToken(user._id); // Generate JWT token
            logger.info("User registered successfully", { userId: user._id, email: user.email });
            res.status(201).json({
                name: user.name,
                _id: user._id,
                email: user.email,
                token: token, // Include the token in the response
                message: "User registered successfully"
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        logger.error("Error during registration", { error: error.message, stack: error.stack });
        res.status(500).json({ message: "Server error" });
    }
};

export { registerUser };
