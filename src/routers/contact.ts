import { Router } from "express";
import {
  createContact,
  getAllContact,
  getOneContact,
  remoteContact,
  updateContact,
} from "../controllers/contact";

const routerContact = Router();
routerContact.get("/", getAllContact);
routerContact.get("/:id", getOneContact);
routerContact.post("/", createContact);
routerContact.patch("/:id", updateContact);
routerContact.delete("/:id", remoteContact);

export default routerContact;
