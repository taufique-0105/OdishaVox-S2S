import express from "express";
import { loginUser } from "../controllers/loginController.js";
import { googleAuth } from "../controllers/authController.js"; // Import googleAuth

const router = express.Router();

router.post("/", loginUser);
router.post("/google", googleAuth); // Add the Google authentication route

export default router;
