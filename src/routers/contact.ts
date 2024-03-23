import { Router } from "express";
import {
  createContact,
  getAllContact,
  getOneContact,
  remoteContact,
  setStaffWithContact,
  updateContact,
  updateContact_note_idOrder,
} from "../controllers/contact";

const routerContact = Router();
routerContact.get("/", getAllContact);
routerContact.get("/:id", getOneContact);
routerContact.post("/", createContact);
routerContact.patch("/:id", updateContact);
routerContact.patch("/:id/staff", setStaffWithContact);
routerContact.patch(
  "/:id/updateContact_note_idOrder",
  updateContact_note_idOrder
);
routerContact.delete("/:id", remoteContact);

export default routerContact;
