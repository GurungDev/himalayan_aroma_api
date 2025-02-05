import { Schema, model } from "mongoose";
import { Types } from "mongoose";
import { paymentMethod, paymentStatus } from "../common/object";

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
    enum: Object.values(paymentStatus),
    required: true,
    default: paymentStatus.PENDING,
  },
},
{
  timestamps: true,
});

const Payment = model("Payment", paymentSchema);
export default Payment;