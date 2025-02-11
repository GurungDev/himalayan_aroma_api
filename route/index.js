import { Router } from "express";
import { authorization } from "../middleware/admin.auth.middleware.js";
import userService from "../service/auth.service.js";
import adminMenuRouter from "./menu.routes.js";
import adminOrderRouter from "./order.routes.js";
import amdinPaymentRouter from "./payment.routes.js";
import adminTableRouter from "./table.routes.js";
import adminController from "../controller/admin.controller.js";
import { allowAdminOnly } from "../middleware/auth.middleware.js";

const allRoutes = Router({ mergeParams: true });

allRoutes.post("/login", userService.login);
allRoutes.post("/send-otp", userService.sendOtp);
allRoutes.post("/staff-register", userService.staffRegister);
allRoutes.use(authorization);
allRoutes.patch("/staff/:id", allowAdminOnly, adminController.activateStaff);
allRoutes.use("/menu", adminMenuRouter);
allRoutes.use("/table", adminTableRouter);
allRoutes.use("/order", adminOrderRouter);
allRoutes.use("/payment", amdinPaymentRouter);

export default allRoutes;
