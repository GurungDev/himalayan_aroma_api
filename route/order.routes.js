import { Router } from "express";
import adminOrderItemsRouter from "./orderItems.routes.js";
import orderController from "../controller/order.controller.js";

const adminOrderRouter = Router({ mergeParams: true });

adminOrderRouter.use("/items", adminOrderItemsRouter);
adminOrderRouter.get("/", orderController.getAllOrder);
adminOrderRouter.post("/", orderController.create);
adminOrderRouter.post("/", orderController.create);

adminOrderRouter.get("/:id", orderController.getById);
adminOrderRouter.patch("/:id", orderController.updateStatus);

export default adminOrderRouter;
