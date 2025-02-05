import { Router } from "express";
import menuRouter from "./staff.menu.routes";
import tableRouter from "./staff.table.routes";
import orderRouter from "./staff.order.routes";
import paymentRouter from "./staff.payment.routes";

const staffRouter = Router({ mergeParams: true });

staffRouter.use("/menu", menuRouter )
staffRouter.use("/table", tableRouter )
staffRouter.use("/order", orderRouter )
staffRouter.use("/payment", paymentRouter )

export default staffRouter;