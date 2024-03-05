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
  removeBill,
} from "../controllers/bill";
import {
  WhyCancelOrder,
  getAllWhyCancelOrder,
} from "../controllers/WhyCancelOrder";

// import { checkPermission } from "../middlewares/checkPermission";
const router = Router();
router.post("/", createBill);
router.post("/whyCanCelOrder", WhyCancelOrder);
router.get("/whyCanCelOrder", getAllWhyCancelOrder);
router.get("/", getAllBill);
router.get("/revenue", dailyRevenueAndCategorySales);
// router.get("/revenue", revenue);
router.get("/:id", getOneBill);
router.delete("/:id", removeBill);
router.get("/user/:id", getBillOfUser);
// router.get("/user/:id", getBillOfUser);
router.patch("/:id/changePaymentStatus", Change_PaymentStatus);
router.patch("/:id/changeOrderStatus", Change_OrderStatus);

export default router;
