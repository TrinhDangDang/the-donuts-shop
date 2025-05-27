// models/MenuItem.ts
import { Document, Schema, Types, model, models } from "mongoose";

interface StockInfo {
  quantity: number;
  lowStockAlert: number;
  autoDisable: boolean;
}

export interface MenuItemDocument extends Document {
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  publicId?: string;
  isMadeToOrder: boolean;
  inStock: boolean;
  stock: StockInfo | null;
}

const MenuItemSchema = new Schema<MenuItemDocument>({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  publicId: String,
  isMadeToOrder: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  stock: {
    type: {
      quantity: { type: Number, default: 0 },
      lowStockAlert: { type: Number, default: 5 },
      autoDisable: { type: Boolean, default: true },
    },
    default: null,
    required: function () {
      return !(this as unknown as MenuItemDocument).isMadeToOrder;
    },
  },
});

MenuItemSchema.pre("save", function (next) {
  const item = this as MenuItemDocument;

  if (item.isMadeToOrder) {
    // Clear stock data for made-to-order items
    item.stock = null;
    item.inStock = true; // Made-to-order items are always "in stock"
  } else {
    // Initialize stock if it's null (when switching from made-to-order to regular)
    if (item.stock === null) {
      item.stock = {
        quantity: 0,
        lowStockAlert: 5,
        autoDisable: true,
      };
    }

    // Handle stock logic for regular items
    if (item.stock && item.stock.quantity <= 0 && item.stock.autoDisable) {
      item.inStock = false;
    }
  }

  next();
});

export default models.MenuItem ||
  model<MenuItemDocument>("MenuItem", MenuItemSchema);
