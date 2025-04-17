import himalayanAroma from "./app.js";
import dbConnection from "./config/db.config.js";
import EnvConfig from "./config/EnvConfig.js";
import { adminSeed } from "./utils/admin.seeder.js";

dbConnection();
const app = himalayanAroma();

app.listen(EnvConfig.port,'0.0.0.0', async () => {
  console.log(`App is running @Port: ${EnvConfig.port}`);
  adminSeed();
});
