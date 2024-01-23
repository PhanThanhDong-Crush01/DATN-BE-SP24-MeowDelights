import express, { Router } from "express";
import {
  createTypeVoucher,
  getAllTypeVoucher,
  getOneTypeVoucher,
  remoteTypeVoucher,
  updateTypeVoucher,
} from "../controllers/type_voucher";

const routerTypeVoucher = Router();
routerTypeVoucher.get("/", getAllTypeVoucher);
routerTypeVoucher.get("/:id", getOneTypeVoucher);
routerTypeVoucher.post("/", createTypeVoucher);
routerTypeVoucher.patch("/:id", updateTypeVoucher);
routerTypeVoucher.delete("/:id", remoteTypeVoucher);

export default routerTypeVoucher;
