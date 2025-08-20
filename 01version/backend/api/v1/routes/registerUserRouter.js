import express from "express";
import { registerUser } from "../controllers/registerUserController.js";
import { googleAuth } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/google", googleAuth);

export default router;
