import express, { Router } from "express";
import { getAllUser, signin, signup } from "../controllers/auth";
import { getUserProfile, updateUserProfile } from "../controllers/user";

const router: Router = express.Router();
router.get("/", getAllUser);
router.post("/signup", signup);
router.post("/signin", signin);
router.patch("/:id", updateUserProfile);
router.get("/:id", getUserProfile);
export default router;
