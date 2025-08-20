import { OAuth2Client } from "google-auth-library";
import User from "../models/userModel.js";
import logger from "../../../logger.js";
import jwt from 'jsonwebtoken'; // Import jsonwebtoken

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Google token is required" });
        }

        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user
            user = await User.create({
                name,
                email,
                username: email.split("@")[0], // simple username
                password: null, // since it's Google login
                googleId: sub,
                profilePicture: picture
            });

            logger.info("New Google user registered", { userId: user._id, email: user.email });
        } else {
            logger.info("Google user logged in", { userId: user._id, email: user.email });
        }

        // Generate JWT token for the user
        const appToken = generateToken(user._id);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            picture: user.profilePicture,
            token: appToken, // Include the application's JWT token
            message: "Google login successful"
        });
    } catch (error) {
        logger.error("Google OAuth error", { error: error.message, stack: error.stack });
        res.status(500).json({ message: "Google login failed" });
    }
};

export { googleAuth };
