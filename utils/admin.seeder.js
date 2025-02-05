import EnvConfig from "../config/EnvConfig.js";
import Admin from "../model/admin.model.js";
 

import { hashString } from "./hash.js";

const password = EnvConfig.adminPassword;

const adminList = [
  {
    email: "test@admin.com",
    password,
  },
];

export async function adminSeed() {
  for (let i = 0; i < adminList.length; i++) {
    const hashedPassword = hashString(adminList[i].password, EnvConfig.hashKey);
    const admin = new Admin({
      email: adminList[i].email,
      password: hashedPassword,
    });
    try {
      await admin.save();
      console.log("Admin user seeded successfully.");
    } catch (err) {
      console.error("Admin Already Exists");
    }
  }
}
