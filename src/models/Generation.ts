import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const generationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    kind: { type: String, enum: ["image", "video", "audio"], required: true },
    prompt: { type: String, required: true },
    model: { type: String, default: "" },
    aspectRatio: { type: String, default: "16:9" },
    duration: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "completed",
    },
    outputs: { type: [String], default: [] },
    thumbnail: { type: String, default: "" },
    creditsUsed: { type: Number, default: 0 },
    providerJobId: { type: String, default: "" },
    mock: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type GenerationDoc = InferSchemaType<typeof generationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Generation =
  models.Generation || model("Generation", generationSchema);
