import express from "express";
import {
  create,
  getDetail,
  remove,
  update,
  getAll,
} from "../controllers/type_product";

const routerTypeproduct = express.Router();
routerTypeproduct.get("/:id", getDetail);
routerTypeproduct.get("/pro/:id", getAll);
routerTypeproduct.post("/", create);
routerTypeproduct.patch("/:id", update);
routerTypeproduct.delete("/:id", remove);
export default routerTypeproduct;
