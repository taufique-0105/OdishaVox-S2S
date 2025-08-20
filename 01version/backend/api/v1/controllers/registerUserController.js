import logger from "../.././../logger.js";
import User from "../models/userModel.js";

const registerUser = async (req, res) => {
    try {
        const { name, username, email, password, confirmPassword } = req.body;

        if (!name || !username || !email || !password || !confirmPassword) {
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
            username,
            email,
            password,
        });

        if (user) {
            logger.info("User registered successfully", { userId: user._id, email: user.email });
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
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
