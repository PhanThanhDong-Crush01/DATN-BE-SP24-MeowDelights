import express, { Router } from "express";
import {
  create,
  get,
  getAll,
  restore,
  storage,
  update,
} from "../controllers/product";
// import { authorization, } from "../middlewares/authorization";
// import { authenticate } from "../middlewares/authenticate";

const router: Router = express.Router();
router.get("/", getAll);
router.get("/:id", get);
router.post("/", create);
router.patch("/restore/:id", restore);
router.patch("/:id/update", update);
router.patch("/storage/:id/", storage);
// router.get("/updateView/:id/", updateView);

export default router;
