import { Router } from "express";
import express from "express";
import {
  createComment,
  getAllComment,
  getAllCommentsOfProduct,
  removeComment,
  updateComment,
} from "../controllers/comment";
// import { checkPermission } from "../middlewares/checkPermission";
const router: Router = express.Router();
router.get("/", getAllComment);
router.get("/product/:id", getAllCommentsOfProduct);
router.post("/", createComment);
router.put("/:id", updateComment);
router.delete("/:id", removeComment);
export default router;
