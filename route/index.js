import { Router } from "express";
import adminController from "../controller/admin.controller.js";
import { authorization } from "../middleware/admin.auth.middleware.js";
import { allowAdminOnly } from "../middleware/auth.middleware.js";
import userService from "../service/auth.service.js";
import adminMenuRouter from "./menu.routes.js";
import adminOrderRouter from "./order.routes.js";
import amdinPaymentRouter from "./payment.routes.js";
import adminTableRouter from "./table.routes.js";
import staffController from "../controller/staff.controller.js";
import paymentController from "../controller/payment.controller.js";
import uploadImage from "../middleware/uploadFile.middleware.js";

const allRoutes = Router({ mergeParams: true });

allRoutes.post("/login", userService.login);
allRoutes.post("/send-otp", userService.sendOtp);
allRoutes.post("/staff-register", uploadImage(false), userService.staffRegister);
allRoutes.patch("/staff-change-password", userService.forgotPassword);
allRoutes.get("/khalti/verify", paymentController.khaltiVerify);
allRoutes.use(authorization);
allRoutes.get("/staff", allowAdminOnly, staffController.getAll);
allRoutes.patch("/staff/:id", allowAdminOnly, adminController.activateStaff);
allRoutes.use("/menu", adminMenuRouter);
allRoutes.use("/table", adminTableRouter);
allRoutes.use("/order", adminOrderRouter);
allRoutes.use("/payment", amdinPaymentRouter);
allRoutes.get("/dashboard", allowAdminOnly, adminController.getDashboardInfo);
export default allRoutes;
