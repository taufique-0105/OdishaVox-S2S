import logger from "../.././../logger.js";
import User from "../models/userModel.js";
import { googleAuth } from "./authController.js"; // Import googleAuth
import jwt from 'jsonwebtoken'; // Import jsonwebtoken

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const loginUser = async (req, res) => {
    try {
        const { email, password, token } = req.body; // Add token to destructuring

        if (token) {
            // If a Google token is provided, delegate to googleAuth
            return googleAuth(req, res);
        }

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Generate JWT token for the user
            const appToken = generateToken(user._id);

            logger.info("User logged in successfully", { userId: user._id, email: user.email });
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: appToken, // Include the application's JWT token
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        logger.error("Error during login", { error: error.message, stack: error.stack });
        res.status(500).json({ message: "Server error" });
    }
};

export { loginUser };
