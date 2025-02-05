import { Schema, model } from "mongoose";

const adminSchema = new Schema(
  {
    email: {
      type: String,
      minLength: 2,
      unique: true,
    },
    password: {
      type: String,
      minLength: 8,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

 
const Admin = model("Admin", adminSchema);
export default Admin;
