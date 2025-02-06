import { Router } from "express";
import tableController from "../controller/table.controller.js";
import { allowAdminOnly } from "../middleware/auth.middleware.js";

const adminTableRouter = Router({ mergeParams: true });
adminTableRouter.get("/", tableController.getAll);
adminTableRouter.get("/get/:id", tableController.getById);
adminTableRouter.post("/", allowAdminOnly, tableController.create);
adminTableRouter.post("/update/:id",allowAdminOnly,  tableController.update);
adminTableRouter.post("/reserve/:id", tableController.toogleReserveTable);

export default adminTableRouter;
