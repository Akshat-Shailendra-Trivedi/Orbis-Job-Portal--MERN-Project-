import express from "express";
import { register, updateProfile } from "../controller/userController.js";
import { login } from "../controller/userController.js";
import { logout } from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { getUser } from "../controller/userController.js";
import { updatePassword } from "../controller/userController.js";


const router = express.Router();

router.post("/register", register); 
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);
router.put("/update/profile", isAuthenticated, updateProfile);
router.put("/update/password", isAuthenticated, updatePassword);

export default router