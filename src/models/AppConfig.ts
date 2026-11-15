import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const appConfigSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: String, default: "" },
    label: { type: String, default: "" },
  },
  { timestamps: true }
);

export type AppConfigDoc = InferSchemaType<typeof appConfigSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AppConfig = models.AppConfig || model("AppConfig", appConfigSchema);
