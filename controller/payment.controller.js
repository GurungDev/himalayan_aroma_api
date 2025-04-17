import axios from "axios";
import EnvConfig from "../config/EnvConfig.js";
import Order from "../model/order.model.js";
import ExpressError from "../common/error.js";
import OrderItem from "../model/orderItem.model.js";
import {
  orderStatus,
  paymentMethod,
  paymentStatus,
  staffRole,
} from "../common/object.js";
import Payment from "../model/payment.model.js";
import { ExpressResponse } from "../common/success.handler.js";
import paginationInfo from "../common/paginationInfo.js";
import Table from "../model/table.model.js";
import mongoose from "mongoose";

class PaymentController {
  constructor() {
    this.initKhaltiPayemnt = this.initKhaltiPayemnt.bind(this);
    this.khaltiInit = this.khaltiInit.bind(this);
    this.khaltiVerify = this.khaltiVerify.bind(this);
    this.cashInPayment = this.cashInPayment.bind(this);
    this.checkKhaltiMobile = this.checkKhaltiMobile.bind(this);
    this.verifyKhaltiPayment = this.verifyKhaltiPayment.bind(this);
  }

  async cashInPayment(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { orderID } = req.body;
      const { id, role } = req.user;

      if (role !== staffRole.STAFF) {
        throw new ExpressError(400, "Only staff can take payment.");
      }

      const order = await Order.findById(orderID).session(session);
      if (!order) {
        throw new ExpressError(404, "Order not found.");
      }

      const orderItems = await OrderItem.find({ orderID }).session(session);
      const totalAmount = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const payment = await new Payment({
        orderId: orderID,
        amount: totalAmount,
        paymentMethod: paymentMethod.CASH,
        paymentStatus: paymentStatus.PAID,
      }).save({ session });

      order.status = orderStatus.PAID;
      await order.save({ session });

      await Table.updateOne(
        { _id: order.table },
        { $set: { isReserved: false } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return ExpressResponse.success(res, { data: payment });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  async initKhaltiPayemnt(
    amount,
    purchase_order_name,
    transaction_uuid,
    orderID
  ) {
    try {
      let data = {
        return_url: `http://${EnvConfig.ip_address}:${EnvConfig.port}/api/khalti-verify?transaction_uuid=${transaction_uuid}&orderID=${orderID}`,
        website_url: `http://${EnvConfig.ip_address}:5173/`,
        amount: amount,
        purchase_order_id: transaction_uuid,
        purchase_order_name,
      };
      let config = {
        headers: {
          Authorization: `key ${EnvConfig.khaltiSecretKey}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(EnvConfig.khaltiUrl, data, config);
      return { success: true, Data: response.data };
    } catch (error) {
      return {
        success: false,
        Message: error.response.data.detail || error.message,
      };
    }
  }

  async verifyKhaltiPayment(payload) {
    try {
      const data = {
        pidx: payload.pidx,
      };

      const config = {
        headers: { Authorization: `key ${EnvConfig.khaltiSecretKey}` },
      };
      console.log("yeha xu ");
      const response = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/lookup/",
        data,
        config
      );

      if (response.data.status !== "Completed") {
        throw new Error(response.data.status);
      }

      return { success: true, Data: response.data };
    } catch (error) {
      return { success: false, Message: error.data || error.message };
    }
  }

  async khaltiInit(req, res, next) {
    try {
      const { transaction_uuid, orderID } = req.body;
      if (!transaction_uuid || !orderID) {
        throw new ExpressError(400, "Missing required fields.");
      }
      const order = await Order.findOne({ _id: orderID });
      const { id, role } = req.user;
      if (role !== staffRole.STAFF) {
        throw new ExpressError(400, "Only staff can take payment.");
      }
      if (!order) {
        throw new ExpressError(404, "order not found.");
      }

      if(order.status == orderStatus.PENDING) {
        throw new ExpressError(400, "Payment already initiated.");
      }

      if(order.status == orderStatus.PAID) {
        throw new ExpressError(400, "Order already paid.");
      }

      const orderItems = await OrderItem.find({ orderID });
      const totalAmount = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const response = await this.initKhaltiPayemnt(
        totalAmount,
        "test",
        transaction_uuid,
        orderID
      );

      if (!response.success) {
        throw new ExpressError(400, response?.Message);
      }
      await new Payment({
        orderId: orderID,
        amount: totalAmount,
        paymentMethod: paymentMethod.KHALTI,
        paymentStatus: paymentStatus.PENDING,
        khaltiPaymentId: transaction_uuid,
      }).save();
      return ExpressResponse.success(res, {
        message: "Khalti Initiated",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  async khaltiVerify(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { transaction_uuid, orderID, pidx } = req.query;

      const order = await Order.findById(orderID);
      if (!order) {
        throw new ExpressError(404, "order not found.");
      }
      const response = await this.verifyKhaltiPayment({
        pidx: pidx,
      });
      if (!response.success) {
        throw new ExpressError(400, response?.Message);
      }

      const payment = await Payment.findOne({
        orderId: orderID,
        khaltiPaymentId: transaction_uuid,
      }).session(session);

      if (!payment) {
        throw new ExpressError(400, "Payment not found.");
      }
      payment.paymentStatus = paymentStatus.PAID;
      await payment.save({ session });
      order.status = orderStatus.PAID;
      await order.save({ session });

      await Table.updateOne(
        { _id: order.table },
        { $set: { isReserved: false } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return ExpressResponse.success(res, {
        message: "Payment Successful",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  async checkKhaltiMobile(req, res, next) {
    try {
      const { orderId } = req.body;

      const response = await Payment.findOne({
        orderId,
      });
      console.log(response);
      if (!response) {
        return ExpressResponse.success(res, {
          message: "Payment not found",
        });
      }
      if (response.paymentStatus == paymentStatus.PENDING) {
        return ExpressResponse.success(res, {
          message: "Payment pending",
        });
      } else if (response.paymentStatus == paymentStatus.PAID) {
        return ExpressResponse.success(res, {
          message: "Payment Success",
        });
      } else if (response.paymentStatus == paymentStatus.FAILED) {
        return ExpressResponse.success(res, {
          message: "Payment Failed",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;
      const [response, count] = await Promise.all([
        Payment.find().limit(limit).skip(skip).lean(),
        Payment.countDocuments(),
      ]);
      return ExpressResponse.success(res, {
        data: response,
        pagination: paginationInfo(count, limit, page),
      });
    } catch (error) {
      next(error);
    }
  }
}

const paymentController = new PaymentController();
export default paymentController;
