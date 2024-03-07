import { Router } from "express";

import express from "express";
import {
  createMyVoucher,
  getAllMyVoucher,
  getAllMyVoucherUser,
  getDetailMyVoucher,
  removeMyVoucher,
  updateMyVoucher,
} from "../controllers/myVoucher";
const router: Router = express.Router();
router.get("/user/:id", getAllMyVoucherUser);
router.get("/:id", getAllMyVoucher);
router.get("/detail/:id", getDetailMyVoucher);
router.post("/", createMyVoucher);
router.patch("/:id", updateMyVoucher);
router.delete("/:id", removeMyVoucher);
export default router;
