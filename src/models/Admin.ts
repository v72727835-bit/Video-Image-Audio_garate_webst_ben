import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["super", "sub"], default: "sub" },
    permissions: { type: [String], default: [] },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export type AdminDoc = InferSchemaType<typeof adminSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Admin = models.Admin || model("Admin", adminSchema);
