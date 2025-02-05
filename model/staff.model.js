import crypto from "crypto";
import { Schema, model } from "mongoose";
import ExpressError from "../common/error.js";
import { staff } from "../common/object.js";

const staffSchema = new Schema(
  {
    firstName: {
      type: String,
      minLength: 2,
      required: false,
    },
    lastName: {
      type: String,
      minLength: 2,
      required: false,
    },
    role: {
      type: String,
      enum: Object.values(staff),
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      required: true,
      default: "ACTIVE",
    },
    email: {
      type: String,
      minLength: 2,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      minLength: 5,
      select: false,
    },
    salt: {
      type: String,
      select: false,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

staffSchema.methods = {
  authenticate(password) {
    if (!password || !this.password) return false;

    const hashedInputPassword = this.hashPassword({ password });

    if (!hashedInputPassword.hashedPassword) return false;

    return hashedInputPassword.hashedPassword === this.password;
  },

  hashPassword({ password, newUser = false }) {
    if (!password && newUser)
      throw new ExpressError(400, "Password is required");
    if (!password && !newUser) return "";

    const relevantSalt = newUser ? this.generateSalt() : this.salt;

    return {
      hashedPassword: crypto
        .createHmac("sha256", relevantSalt)
        .update(password)
        .digest("hex"),
      salt: relevantSalt,
    };
  },

  generateSalt() {
    const salt = Math.round(new Date().valueOf() * Math.random()) + "";
    return salt;
  },
};

const Staff = model("Staff", staffSchema);
export default Staff;
