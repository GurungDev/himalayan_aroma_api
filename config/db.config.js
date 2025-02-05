import mongoose from "mongoose";
import EnvConfig from "./EnvConfig.js";

export default async function dbConnection() {
  const result = await mongoose.connect(EnvConfig.dbUri);
  const { host, port, name } = result.connection;

  console.log(`Connected to DB @${host}:${port}, DB:${name}`);
}
