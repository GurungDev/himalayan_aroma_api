 import { config } from "dotenv";
import ExpressError from "../common/error.js";

config();

export default class EnvConfig {
  static port = this.#getNumber(this.#getFromEnv("PORT"));
 
  static dbUri = this.#getString(this.#getFromEnv("DB_URL"));
 
  static jwtSecret = this.#getString(this.#getFromEnv("JWT_SECRET"));
  static hashKey = this.#getString(this.#getFromEnv("HASH_KEY"));
  static adminPassword = this.#getString(this.#getFromEnv("ADMIN_PASSWORD"));

  static sendgridApiKey = this.#getString(this.#getFromEnv("SENDGRID_API_KEY"));
  static genericEmailSender = this.#getString(
    this.#getFromEnv("GENERIC_EMAIL_SENDER")
  );
  
  static #getFromEnv(key) {
    const value = process.env[key];
    if (!value) {
      throw new ExpressError(400, `Env config error. Didn't find key: ${key}`);
    }
    return value;
  }

  static #getString(value) {
    return value;
  }

  static #getNumber(value) {
    const returnValue = Number(value);

    if (isNaN(returnValue)) {
      throw new ExpressError(400, `Env config error. Number type NaN.`);
    }

    return returnValue;
  }
}
