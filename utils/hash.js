import crypto from "crypto";
import EnvConfig from "../config/EnvConfig.js";

export function hashString(data) {
  return crypto
    .createHmac("sha256", EnvConfig.hashKey)
    .update(data)
    .digest("hex");
}
