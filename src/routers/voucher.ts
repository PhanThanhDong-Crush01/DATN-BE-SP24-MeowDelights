import { Router } from "express";
import {
  createVoucher,
  getAllVoucher,
  getDetailVoucher,
  phanPhatVouher,
  removeVoucher,
  updateVoucher,
} from "../controllers/voucher";
import express from "express";
// import { checkPermission } from "../middlewares/checkPermission";
const router: Router = express.Router();
router.get("/", getAllVoucher);
router.get("/:id", getDetailVoucher);
router.post("/", createVoucher);
router.patch("/:id", updateVoucher);
router.delete("/:id", removeVoucher);
router.post("/phanPhatVouher", phanPhatVouher);
export default router;
