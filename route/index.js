import { Router } from "express";
import { authorization } from "../middleware/admin.auth.middleware.js";
import userService from "../service/auth.service.js";
import adminMenuRouter from "./menu.routes.js";
import adminOrderRouter from "./order.routes.js";
import amdinPaymentRouter from "./payment.routes.js";
import adminTableRouter from "./table.routes.js";

const allRoutes = Router({ mergeParams: true });

allRoutes.post("/login", userService.login);
allRoutes.use(authorization);
allRoutes.use("/menu", adminMenuRouter);
allRoutes.use("/table", adminTableRouter);
allRoutes.use("/order", adminOrderRouter);
allRoutes.use("/payment", amdinPaymentRouter);

export default allRoutes;
