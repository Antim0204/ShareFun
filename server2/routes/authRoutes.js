//create the express router
import express from "express";
import { login,register } from "../controllers/authController.js";

const router=express.Router();

//creating end point
router.post("/register",register);

router.post("/login",login);
export default router;

