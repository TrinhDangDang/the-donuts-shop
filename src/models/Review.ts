import mongoose, { Schema, Document } from "mongoose";

// Interface for Review document
interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  menuItemId: mongoose.Types.ObjectId;
  message: string;
  star: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    star: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);
ReviewSchema.index({ userId: 1, menuItemId: 1 }, { unique: true });
export default mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);
