import { Router } from "express";
import productRouter from "./product";
import categoryRouter from "./category";

import authRouter from "./auth";
import cartRouter from "./cart";

import voucherRouter from "./voucher";
import typeVoucherRouter from "./typeVoucher";

import billRouter from "./bill";
import billDetailRouter from "./billDetail";

import uploadRouter from "./upload";
const router = Router();

router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/carts", cartRouter);
router.use("/auth", authRouter);
router.use("/voucher", voucherRouter);
router.use("/type_voucher", typeVoucherRouter);
router.use("/bill", billRouter);
router.use("/bill_detail", billDetailRouter);
router.use("/upload", uploadRouter);

export default router;
