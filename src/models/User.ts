import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  DoB: { type: Date }, // Date of Birth
  password: { type: String, required: true }, // Password
  points: { type: Number, default: 0 }, // Loyalty or reward points
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
