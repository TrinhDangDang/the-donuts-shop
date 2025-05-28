import mongoose, { Document, Schema, Model } from "mongoose";

// 1. Define the interface
export interface IMenuItem extends Document {
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  publicId?: string;
  isMadeToOrder: boolean;
  inStock: boolean;
  stock: number; // Changed to simple number based on your schema
}

// 2. Define the schema
const MenuItemSchema = new Schema<IMenuItem>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    publicId: { type: String },
    isMadeToOrder: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// 3. Handle Next.js hot-reloads
let MenuItem: Model<IMenuItem>;

if (mongoose.models.MenuItem) {
  // If model already exists, use it
  MenuItem = mongoose.models.MenuItem as Model<IMenuItem>;
} else {
  // If not, create new model
  MenuItem = mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);
}

export default MenuItem;
