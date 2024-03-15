import express, { Router } from "express";
import {
  create,
  getAllCartOfUser,
  getOne,
  remove,
  removeCartUser,
  update,
} from "../controllers/cart";

const router: Router = express.Router();

router.get("/user/:id", getAllCartOfUser);
router.get("/:id", getOne);
router.post("/", create);
router.patch("/", update);
router.delete("/:id", remove);
router.delete("/user/:id", removeCartUser);

export default router;
