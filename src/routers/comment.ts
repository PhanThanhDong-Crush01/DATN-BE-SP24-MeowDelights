import { Router } from "express";
import express from "express";
import {
  createComment,
  getAllComment,
  getAllCommentsByBillId,
  getAllCommentsOfProduct,
  getCheckComment,
  getDetail,
  removeComment,
  statisticsComment,
  statisticsStar,
  updateComment,
} from "../controllers/comment";
// import { checkPermission } from "../middlewares/checkPermission";
const router: Router = express.Router();
router.get("/", getAllComment);
router.get("/bill/:id", getAllCommentsByBillId);
router.post("/check", getCheckComment);
router.get("/star/product/:id", statisticsStar);
router.get("/totalComment/product/:id", statisticsComment);
router.get("/:id", getDetail);
router.get("/product/:id", getAllCommentsOfProduct);
router.post("/", createComment);
router.put("/:id", updateComment);
router.delete("/:id", removeComment);
export default router;
