import ExpressError from "../common/error.js";
import { orderStatus, staffRole, userRole } from "../common/object.js";
import paginationInfo from "../common/paginationInfo.js";
import { ExpressResponse } from "../common/success.handler.js";
import Order from "../model/order.model.js";
import Table from "../model/table.model.js";

class OrderController {
  async getAllOrder(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;
      const { table, staff, status } = req.body;
      const query = {};
      if (table) query.table = table;
      if (staff) query.staff = staff;
      if (status) query.status = status;

      const [responseOrder, countOrder] = await Order.find(query)
        .limit(limit)
        .skip(skip)
        .lean()
        .exec();
      return ExpressResponse.success(res, {
        data: responseOrder,
        pagination: paginationInfo(countOrder, limit, page),
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;    
      const order = await Order.findById(id)
        .populate("orderItemsList table staff")
        .lean();
      return ExpressResponse.success(res, { data: order });
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      const { table, remarks } = req.body;
      const { id } = req.user;

      const isTableReserved = await Table.findById(table);
      if (isTableReserved.isReserved) {
        throw new ExpressError(400, "Table is already reserved");
      }
      isTableReserved.isReserved = true;
      const newOrder = await Order.create({ table, staff: id, remarks });
      await isTableReserved.save();

      return ExpressResponse.success(res, { data: newOrder });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await Order.findById(id).populate("table");
      if (!order) {
        throw new ExpressError(404, "Order not found");
      }
      if (!Object.values(orderStatus).includes(status)) {
        throw new ExpressError(400, "Invalid status");
      }
      const { staffJob } = req.user;
      if (
        [orderStatus.IN_PROGRESS, orderStatus.COMPLETE].includes(status) &&
        staffJob !== staffRole.CHEF
      ) {
        throw new ExpressError(
          400,
          "Only chef are authorized to update this status."
        );
      }

      if (
        [orderStatus.SERVED, orderStatus.CANCELED].includes(status) &&
        staffJob !== staffRole.WAITER
      ) {
        throw new ExpressError(
          400,
          "Only waiter are authorized to update this status"
        );
      }

      if (
        [orderStatus.PAID].includes(status) &&
        staffJob !== staffRole.CASHIER
      ) {
        throw new ExpressError(
          400,
          "Only Cashier are authorized to update this status"
        );
      }

      order.status = status;
      const updatedOrder = await order.save();
      if (order.status == orderStatus.PAID && staffJob == staffRole.CASHIER) {
        const table = await Table.updateOne(
          { _id: order.table._id },
          { isReserved: false }
        );
        await table.save();
      }
      return ExpressResponse.success(res, { data: updatedOrder });
    } catch (error) {
      next(error);
    }
  }
}

const orderController = new OrderController();
export default orderController;
