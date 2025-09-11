import { OAuth2Client } from "google-auth-library";
import User from "../models/userModel.js";
import logger from "../../../logger.js";
import jwt from "jsonwebtoken";
import fetch from "node-fetch"; // if using Node 18+, you can remove this and use global fetch

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        console.log(token)

        if (!token) {
            return res.status(400).json({ message: "Google token is required" });
        }

        let payload;

        if (token.startsWith("ya29.")) {
            // ✅ Access Token case (ya29...)
            const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json());

            if (userInfo.error || !userInfo.email) {
                return res.status(401).json({ message: "Invalid Google access token" });
            }

            payload = {
                sub: userInfo.sub,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
            };
        } else {
            // ✅ ID Token case (JWT from Google One-Tap / Expo id_token)
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_WEB_CLIENT_ID,
            });
            payload = ticket.getPayload();
        }

        const { sub, email, name, picture } = payload;

        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                password: null, // no password for Google login
                googleId: sub,
                profilePicture: picture,
            });
            logger.info("New Google user registered", { userId: user._id, email: user.email });
        } else {
            logger.info("Google user logged in", { userId: user._id, email: user.email });
        }

        // Generate app’s JWT token
        const appToken = generateToken(user._id);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            name: user.name,
            picture: user.profilePicture,
            token: appToken,
            message: "Google login successful",
        });
    } catch (error) {
        logger.error("Google OAuth error", { error: error.message, stack: error.stack });
        res.status(500).json({ message: "Google login failed" });
    }
};

export { googleAuth };
