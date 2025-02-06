import { Schema, model } from "mongoose";

const menuSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true,
  },
  isSpecial: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
});

const Menu = model("Menu", menuSchema);
export default Menu;