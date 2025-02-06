import { Router } from "express";
import menuController from "../controller/menu.controller.js";
import { allowAdminOnly } from "../middleware/auth.middleware.js";

const adminMenuRouter = Router({ mergeParams: true });
adminMenuRouter.post("/", allowAdminOnly, menuController.create);
adminMenuRouter.post("/update/:id",allowAdminOnly, menuController.update);
adminMenuRouter.get("/", menuController.getAll);
adminMenuRouter.get("/get/:id", menuController.getById);

export default adminMenuRouter;