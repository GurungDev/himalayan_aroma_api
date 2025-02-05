import { Router } from "express";
import userService from "../service/auth.service.js";
import adminRouter from "./admin/admin.routes.js";
import staffRouter from "./staff/staff.routes.js";
import { authorization } from "../middleware/admin.auth.middleware.js";
 
const allRoutes = Router({ mergeParams: true });

allRoutes.post("/login", userService.login);
allRoutes.use(authorization)
allRoutes.use("/admin", adminRouter);
allRoutes.use("/staff", staffRouter);

export default allRoutes;
