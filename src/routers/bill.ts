// import express, { Router } from "express";

// const router: Router = express.Router();

// export default router;
import { Router } from "express";
import { createBill, getAllBill } from "../controllers/bill";

// import { checkPermission } from "../middlewares/checkPermission";
const router = Router();
router.post("/", createBill);
router.get("/", getAllBill);

export default router;
