import express, { Router } from "express";
import {
  AuthWithRole,
  createAuth,
  deleteEmployee,
  createKhachVangLai,
  editAuth,
  getAllUser,
  getOne,
  removeUser,
  setEmployeeCode,
  signin,
  signup,
} from "../controllers/auth";
import {
  getUserProfile,
  updateUserProfile,
  updateUserRole,
} from "../controllers/user";

const router: Router = express.Router();
router.get("/", getAllUser);
router.post("/signup", signup);
router.post("/createAuth", createAuth);
router.post("/createKhachVangLai", createKhachVangLai);
router.patch("/editAuth/:id", editAuth);
router.post("/signin", signin);
router.delete("/:id", removeUser);
router.patch("/roleUser/:id", updateUserRole);
router.patch("/:id", updateUserProfile);
router.patch("/deleteEmployee/:id", deleteEmployee);
router.patch("/:id/setEmployeeCode", setEmployeeCode);
router.get("/:id", getUserProfile);
// router.get("/:id", getOne);
router.get("/:id/permission", AuthWithRole);
export default router;
