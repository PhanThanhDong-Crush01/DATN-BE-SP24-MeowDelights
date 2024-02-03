import express, { Router } from "express";
import { create, get, getAll, restore, storage } from "../controllers/product";
// import { authorization, } from "../middlewares/authorization";
// import { authenticate } from "../middlewares/authenticate";

const router: Router = express.Router();
router.get("/", getAll);
router.get("/:id", get);
router.post("/", create);
router.patch("/restore/:id", restore);
// router.put("/:id/update", authenticate, authorization, update)
router.patch("/storage/:id/", storage);


export default router;
