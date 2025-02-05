import { Router } from "express";
import adminOrderItemsRouter from "./admin.orderItems.routes";

const adminOrderRouter = Router({ mergeParams: true });
adminOrderRouter.use("/items", adminOrderItemsRouter)

export default adminOrderRouter;