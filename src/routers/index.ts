import { Router } from "express";
import productRouter from "./product";
import categoryRouter from "./category";

import authRouter from "./auth";
import cartRouter from "./cart";

import voucherRouter from "./voucher";
import myVoucherRouter from "./myVoucher";
import typeVoucherRouter from "./typeVoucher";
import commentRouter from "./comment";
import billRouter from "./bill";
import billDetailRouter from "./billDetail";

import uploadRouter from "./upload";
import deleteAllDataRouter from "./deleteAllData";
import routerContact from "./contact";
import routerTypeproduct from "./type_product";

const router = Router();

router.use("/products", productRouter);
router.use("/type_product", routerTypeproduct);
router.use("/contact", routerContact);
router.use("/categories", categoryRouter);
router.use("/cart", cartRouter);
router.use("/auth", authRouter);
router.use("/voucher", voucherRouter);
router.use("/my_voucher", myVoucherRouter);
router.use("/comment", commentRouter);
router.use("/type_voucher", typeVoucherRouter);
router.use("/bill", billRouter);
router.use("/bill_detail", billDetailRouter);
router.use("/upload", uploadRouter);
router.use("/deleteAllData", deleteAllDataRouter);

export default router;
