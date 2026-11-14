import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: "" },
    plan: {
      type: String,
      enum: ["free", "starter", "premium", "business"],
      default: "free",
    },
    credits: { type: Number, default: 150 },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const User = models.User || model("User", userSchema);
