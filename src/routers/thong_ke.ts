import express from "express";
import { thong_ke } from "../controllers/thongke";

const routerThongKe = express.Router();
routerThongKe.get("/", thong_ke);
export default routerThongKe;
