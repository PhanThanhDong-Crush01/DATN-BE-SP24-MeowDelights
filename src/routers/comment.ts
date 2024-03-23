import { Router } from "express";
import express from "express";
import {
  createComment,
  getAllComment,
  getAllCommentsOfProduct,
  getDetail,
  removeComment,
  statisticsComment,
  updateComment,
} from "../controllers/comment";
// import { checkPermission } from "../middlewares/checkPermission";
const router: Router = express.Router();
router.get("/", getAllComment);
router.get("/star/product/:id", statisticsComment);
router.get("/:id", getDetail);
router.get("/product/:id", getAllCommentsOfProduct);
router.post("/", createComment);
router.put("/:id", updateComment);
router.delete("/:id", removeComment);
export default router;
