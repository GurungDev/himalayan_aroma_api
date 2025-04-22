import { Router } from "express";
import menuController from "../controller/menu.controller.js";
import { allowAdminOnly } from "../middleware/auth.middleware.js";
import uploadImage from "../middleware/uploadFile.middleware.js";

const adminMenuRouter = Router({ mergeParams: true });
adminMenuRouter.post(
  "/",
  allowAdminOnly,
  uploadImage(),
  menuController.create
);
adminMenuRouter.post(
  "/update/:id",
  allowAdminOnly,
  uploadImage(false),
  menuController.update
);
adminMenuRouter.get("/", menuController.getAll);
adminMenuRouter.get("/get/:id", menuController.getById);

export default adminMenuRouter;
