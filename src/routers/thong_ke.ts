import express from "express";
import {
  getTop10ViewProducts,
  thong_ke_doanh_thu,
  thong_ke_doanh_thu_thang_trong_nam,
  thong_ke_top_10_product,
} from "../controllers/thongke";

const routerThongKe = express.Router();
routerThongKe.get("/top10product", thong_ke_top_10_product);
routerThongKe.post("/thong_ke_doanh_thu", thong_ke_doanh_thu);
routerThongKe.get(
  "/thong_ke_doanh_thu_thang_trong_nam/:id",
  thong_ke_doanh_thu_thang_trong_nam
);
routerThongKe.get("/getTop10ViewProducts", getTop10ViewProducts);
export default routerThongKe;
