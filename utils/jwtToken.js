import jwt from "jsonwebtoken";
import EnvConfig from "../config/EnvConfig.js";

const secretKey = EnvConfig.jwtSecret;

export  function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return false;
  }
}

export  function CreateJWT(token) {
  try {
    const token = jwt.sign(token, secretKey,{
      expiresIn: 8640000,
    } );
    return token;
  } catch (error) {
    return false;
  }
}

 