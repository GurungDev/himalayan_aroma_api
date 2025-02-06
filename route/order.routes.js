import { Router } from "express";
import adminOrderItemsRouter from "./orderItems.routes.js";

const adminOrderRouter = Router({ mergeParams: true });
adminOrderRouter.use("/items", adminOrderItemsRouter)
// adminOrderRouter.get("/", orderController.getAll);

export default adminOrderRouter;