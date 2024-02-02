// import express, { Router } from "express";

// const router: Router = express.Router();

// export default router;
import { Router } from "express";
import {
  Change_OrderStatus,
  Change_PaymentStatus,
  createBill,
  dailyRevenueAndCategorySales,
  getAllBill,
  getBillOfUser,
  getOneBill,
} from "../controllers/bill";

// import { checkPermission } from "../middlewares/checkPermission";
const router = Router();
router.post("/", createBill);
router.get("/", getAllBill);
router.get("/revenue", dailyRevenueAndCategorySales);
// router.get("/revenue", revenue);
router.get("/:id", getOneBill);
router.get("/user/:id", getBillOfUser);
router.patch("/:id/changePaymentStatus", Change_PaymentStatus);
router.patch("/:id/changeOrderStatus", Change_OrderStatus);

export default router;
