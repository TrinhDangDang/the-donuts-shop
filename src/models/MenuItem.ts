// models/MenuItem.ts
import { Document, Schema, Types, model, models } from "mongoose";

export interface MenuItemDocument extends Document {
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isMadeToOrder: boolean;
  inStock: boolean;
  stock: {
    quantity: number;
    lowStockAlert: number;
    autoDisable: boolean;
  };
}

const MenuItemSchema = new Schema<MenuItemDocument>({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  isMadeToOrder: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  stock: {
    quantity: { type: Number, default: 0 },
    lowStockAlert: { type: Number, default: 5 },
    autoDisable: { type: Boolean, default: true },
  },
});

MenuItemSchema.pre("save", function (next) {
  if (
    !this.isMadeToOrder &&
    this.stock &&
    this.stock.quantity <= 0 &&
    this.stock.autoDisable
  ) {
    this.inStock = false;
  }
  next();
});

export default models.MenuItem ||
  model<MenuItemDocument>("MenuItem", MenuItemSchema);
