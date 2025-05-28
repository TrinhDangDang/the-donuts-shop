// models/MenuItem.ts
import { Document, Schema, Types, model, models } from "mongoose";

// interface StockInfo {
//   quantity: number;
//   lowStockAlert: number;
//   autoDisable: boolean;
// }

export interface MenuItemDocument extends Document {
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  publicId?: string;
  isMadeToOrder: boolean;
  inStock: boolean;
  stock: number;
}

const MenuItemSchema = new Schema<MenuItemDocument>({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  publicId: String,
  isMadeToOrder: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
});

// MenuItemSchema.pre("save", function (next) {
//   const item = this as MenuItemDocument;

//   if (item.isMadeToOrder) {
//     // Clear stock data for made-to-order items
//     item.stock = null;
//     item.inStock = true; // Made-to-order items are always "in stock"
//   } else {
//     // Initialize stock if it's null (when switching from made-to-order to regular)
//     if (item.stock === null) {
//       item.stock = {
//         quantity: 0,
//         lowStockAlert: 5,
//         autoDisable: true,
//       };
//     }

//     if (item.stock) {
//       const { quantity, autoDisable } = item.stock;

//       // If quantity is 0 and autoDisable is true, mark the item as out of stock
//       if (quantity <= 0 && autoDisable) {
//         item.inStock = false;
//       } else if (quantity > 0) {
//         // If quantity is greater than 0, mark the item as in stock
//         item.inStock = true;
//       }
//     }
//   }

//   next();
// });

export default models.MenuItem ||
  model<MenuItemDocument>("MenuItem", MenuItemSchema);
