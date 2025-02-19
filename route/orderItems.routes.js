import { Router } from "express";
import orderItemController from "../controller/orderItem.Controller.js";

const adminOrderItemsRouter = Router({ mergeParams: true });

adminOrderItemsRouter.post("/", orderItemController.addOrderItem);
adminOrderItemsRouter.delete("/:id", orderItemController.removeASingleOrderItem);
adminOrderItemsRouter.patch("/:id", orderItemController.updateOrderItem);

export default adminOrderItemsRouter;