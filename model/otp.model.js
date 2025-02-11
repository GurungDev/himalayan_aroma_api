import mongoose from "mongoose";
import { OtpPurpose } from "../common/object.js";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    purpose: { type: String, enum: Object.values(OtpPurpose), required: true },

    isRevoked: { type: Boolean, default: false, index: { expires: "5m" } },
  },
  { timestamps: true }
);

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
