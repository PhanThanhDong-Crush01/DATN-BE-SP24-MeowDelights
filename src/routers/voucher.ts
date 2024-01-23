import { Router } from "express";
import {
  createVoucher,
  getAllVoucher,
  getDetailVoucher,
  removeVoucher,
  updateVoucher,
} from "../controllers/voucher";
// import { checkPermission } from "../middlewares/checkPermission";
const router = Router();
router.get("/", getAllVoucher);
router.get("/:id", getDetailVoucher);
router.post("/", createVoucher);
router.put(`/:id`, updateVoucher);
router.delete("/:id", removeVoucher);
export default router;
