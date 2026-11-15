import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const pageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    content: { type: String, default: "" }, // markdown
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type PageDoc = InferSchemaType<typeof pageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Page = models.Page || model("Page", pageSchema);
