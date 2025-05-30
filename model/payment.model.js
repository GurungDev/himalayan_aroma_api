import { Schema, model } from "mongoose";
import { Types } from "mongoose";
import { paymentMethod, paymentStatus } from "../common/object.js";

const paymentSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  orderId: {
    type: Types.ObjectId,
    ref: "Order",
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: Object.values(paymentMethod),
    required: true,
  },
  paymentStatus: {
    type: String,
    default: paymentStatus.PENDING,
    enum: Object.values(paymentStatus),
    required: true,
  },

  khaltiPaymentId: {
    type: String,
    required: false,
  },
},
{
  timestamps: true,
});

const Payment = model("Payment", paymentSchema);
export default Payment;