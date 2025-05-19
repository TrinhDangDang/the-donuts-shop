import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  DoB: { type: Date }, // Date of Birth
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  rewardPoints: { type: Number, default: 0 }, // Total accumulated points
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
});

// Middleware to update the updatedAt field before saving
UserSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
