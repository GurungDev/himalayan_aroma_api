import { Schema, model } from "mongoose";
import { Types } from "mongoose";
import { orderStatus } from "../common/object";

const orderSchema = new Schema({
  remarks: {
    type: String,
  },
  tableId: {
    type: Types.ObjectId,
    ref: "Table",
    required: true,
  },
  staffId: {
    type: Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(orderStatus),
    default: orderStatus.PENDING,
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
},
{
  timestamps: true,
});

const Order = model("Order", orderSchema);
export default Order;