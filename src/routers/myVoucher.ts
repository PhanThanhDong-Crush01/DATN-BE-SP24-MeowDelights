import { Router } from "express";

import express from "express";
import {
  createMyVoucher,
  getAllMyVoucher,
  getDetailMyVoucher,
  removeMyVoucher,
  updateMyVoucher,
} from "../controllers/myVoucher";
const router: Router = express.Router();
router.get("/", getAllMyVoucher);
router.get("/:id", getDetailMyVoucher);
router.post("/", createMyVoucher);
router.patch("/:id", updateMyVoucher);
router.delete("/:id", removeMyVoucher);
export default router;
