import { Schema, model } from "mongoose";
import { Types } from "mongoose";

const orderItemSchema = new Schema({
  orderID: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  menuID: {
    type: Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
},
{
  timestamps: true,
});

const OrderItem = model("OrderItem", orderItemSchema);
export default OrderItem;