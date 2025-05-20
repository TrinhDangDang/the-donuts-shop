import mongoose, { Schema, Document } from "mongoose";

// Define interface for Menu Item reference in orders
interface IOrderMenuItem {
  menuItemId: mongoose.Types.ObjectId;
  quantity: number;
  priceAtOrder: number;
  specialInstructions?: string;
}

// Define interface for Order document
export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  menuItems: IOrderMenuItem[];
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
}

const OrderSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    menuItems: [
      {
        menuItemId: {
          type: Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtOrder: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
