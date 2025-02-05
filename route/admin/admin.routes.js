import { Router } from "express";
import adminMenuRouter from "./admin.menu.routes";
import adminOrderRouter from "./admin.order.routes";
import amdinPaymentRouter from "./admin.payment.routes";
import adminTableRouter from "./admin.table.routes";

const adminRouter = Router({ mergeParams: true });

adminRouter.use("/menu", adminMenuRouter)
adminRouter.use("/table", adminTableRouter )
adminRouter.use("/order", adminOrderRouter )
adminRouter.use("/payment", amdinPaymentRouter )

export default adminRouter;