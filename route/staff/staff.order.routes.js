import { Router } from "express";
import orderItemsRouter from "./staff.orderItems.routes";

const orderRouter = Router({ mergeParams: true });
orderRouter.use("/items", orderItemsRouter)

export default orderRouter;