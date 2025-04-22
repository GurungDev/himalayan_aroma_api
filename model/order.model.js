import { Schema, model } from "mongoose";
import { orderStatus } from "../common/object.js";

const orderSchema = new Schema(
  {
    remarks: {
      type: String,
    },
    table: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    staff: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(orderStatus),
      default: orderStatus.PENDING,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

orderSchema.virtual("orderItemsList", {
  ref: "OrderItem",
  localField: "_id",
  foreignField: "orderID",
});

const Order = model("Order", orderSchema);
export default Order;
