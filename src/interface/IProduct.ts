// models/product.ts
import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  image: string;
  import_date: Date;
  expiry: string;
  status: boolean;
  description: string;
  idCategory: string;
}
