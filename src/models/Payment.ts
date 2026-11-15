import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

const paymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    userEmail: { type: String, default: "" },
    userName: { type: String, default: "" },
    plan: { type: String, required: true },
    amount: { type: Number, required: true }, // paise
    credits: { type: Number, default: 0 },
    orderId: { type: String, default: "" },
    paymentId: { type: String, default: "" },
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
    validUntil: { type: Date },
  },
  { timestamps: true }
);

export type PaymentDoc = InferSchemaType<typeof paymentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Payment = models.Payment || model("Payment", paymentSchema);
