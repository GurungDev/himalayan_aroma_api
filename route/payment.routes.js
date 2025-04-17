import { Router } from "express";
import paymentController from "../controller/payment.controller.js";

const amdinPaymentRouter = Router({ mergeParams: true });
amdinPaymentRouter.post("/",  paymentController.cashInPayment);
amdinPaymentRouter.post("/khalti", paymentController.khaltiInit);
 
amdinPaymentRouter.post("/khalti/check-mobile", paymentController.checkKhaltiMobile);
amdinPaymentRouter.get("/", paymentController.getAll);

export default amdinPaymentRouter;