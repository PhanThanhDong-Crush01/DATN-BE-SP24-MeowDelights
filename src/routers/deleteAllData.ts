import express from "express";
import { deleteAllData } from "../controllers/deleteAll/deleteAll";

const router = express.Router();
router.delete("/", deleteAllData);

export default router;
