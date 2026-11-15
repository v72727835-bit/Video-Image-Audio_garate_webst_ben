import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const activitySchema = new Schema(
  {
    actor: { type: String, required: true }, // admin email
    action: { type: String, required: true }, // e.g. "user.suspend"
    target: { type: String, default: "" }, // human-readable target
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export type ActivityDoc = InferSchemaType<typeof activitySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ActivityLog = models.ActivityLog || model("ActivityLog", activitySchema);
