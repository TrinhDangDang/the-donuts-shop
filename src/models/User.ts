// models/User.ts
import mongoose, { Document, Schema, model, models } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  DoB?: Date;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  rewardPoints: number;
  role: "customer" | "admin";
  address: string;
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  DoB: { type: Date },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  rewardPoints: { type: Number, default: 0 },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  address: { type: String, required: false },
});

UserSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default models.User || model<UserDocument>("User", UserSchema);
