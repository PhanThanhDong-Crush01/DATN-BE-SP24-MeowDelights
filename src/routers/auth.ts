import express, { Router } from "express";
import {
  getAll,
  getOne,
  removeUser,
  signin,
  signup,
} from "../controllers/auth";
import { getUserProfile, updateUserProfile } from "../controllers/user";

const router: Router = express.Router();
router.get("/", getAll);
router.post("/signup", signup);
router.post("/signin", signin);
router.delete("/:id", removeUser);

router.patch("/:id", updateUserProfile);
router.get("/:id", getUserProfile);
// router.get("/:id", getOne);
export default router;
