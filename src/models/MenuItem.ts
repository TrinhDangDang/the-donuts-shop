import mongoose, { mongo } from "mongoose";
const MenuItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  inStock: { type: Boolean, default: true },
});

export default mongoose.models.MenuItem ||
  mongoose.model("MenuItem", MenuItemSchema);
