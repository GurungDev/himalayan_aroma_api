import ExpressError from "../common/error.js";
import { ExpressResponse } from "../common/success.handler.js";
import Menu from "../model/menu.model.js";
import Order from "../model/order.model.js";
import OrderItem from "../model/orderItem.model.js";

class OrderItemsController {
  constructor() {
    this.addOrderItem = this.addOrderItem.bind(this);
    this.removeASingleOrderItem = this.removeASingleOrderItem.bind(this);
    this.updateOrderItem = this.updateOrderItem.bind(this);

  }

  async #addOrderItemToModel(order, orderItems) {
    if (!order || !orderItems || !Array.isArray(orderItems)) {
      throw new ExpressError(400, "Invalid order or order items");
    }
  
    // Step 1: Fetch all existing order items for this order
    const existingOrderItems = await OrderItem.find({ orderID: order._id });
  
    // Step 2: Create a map of existing order items for quick lookup
    const existingItemsMap = new Map(existingOrderItems.map(item => [item.menuID.toString(), item]));
  
    // Step 3: Process the new order items list
    const itemsToInsert = [];
    const itemsToUpdate = [];
  
    for (const item of orderItems) {
      if (!item.menuID || !item.quantity) {
        throw new ExpressError(400, "Missing required fields");
      }
  
      const menu = await Menu.findById(item.menuID);
      if (!menu) throw new ExpressError(404, "Menu not found");
      if (!menu.isAvailable) throw new ExpressError(400, "Menu is not available");
  
      const existingOrderItem = existingItemsMap.get(item.menuID.toString());
  
      if (existingOrderItem) {
        // If item exists, update quantity and price
        existingOrderItem.quantity = item.quantity;
        existingOrderItem.price = menu.price * existingOrderItem.quantity;
        itemsToUpdate.push(existingOrderItem);
        existingItemsMap.delete(item.menuID.toString()); // Remove from map
      } else {
        // If item does not exist, add it to insert list
        itemsToInsert.push({
          orderID: order._id,
          menuID: item.menuID,
          quantity: item.quantity,
          price: menu.price * item.quantity,
        });
      }
    }
  
    // Step 4: Delete items that were not in the new list
    const itemsToDelete = Array.from(existingItemsMap.values());
    if (itemsToDelete.length) {
      await OrderItem.deleteMany({ _id: { $in: itemsToDelete.map(item => item._id) } });
    }
    if (itemsToUpdate.length) {
      await Promise.all(itemsToUpdate.map(item => item.save())); // Update in parallel
    } 
    if (itemsToInsert.length) {
      await OrderItem.insertMany(itemsToInsert);
    }
  }
  

  async addOrderItem(req, res, next) {
    try {
      const { orderId, orderItems } = req.body;
      if (!orderId || !orderItems) {
        throw new ExpressError(400, "Missing required fields");
      }
      const order = await Order.findById(orderId);
      if (!order) {
        throw new ExpressError(404, "Order not found");
      }
      await this.#addOrderItemToModel(order, orderItems);
      ExpressResponse.success(res, { data: "success" });
    } catch (error) {
      next(error);
    }
  }

  async removeASingleOrderItem(req, res, next) {
    try {
      const { id } = req.params;
      const orderItem = await OrderItem.findById(id);
      if (!orderItem) {
        throw new ExpressError(404, "Order item not found");
      }
      await orderItem.deleteOne();
      return ExpressResponse.success(res, { message: "successfully deleted" });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderItem(req, res, next) {
    try {
      const orderItem = await OrderItem.findById(req.params.id).populate(
        "menuID"
      );
      if (!orderItem) {
        throw new ExpressError(404, "Order item not found");
      }
      orderItem.quantity = req.body.quantity;
      if (orderItem.quantity < 1) {
        await orderItem.deleteOne();
        return ExpressResponse.success(res, {
          message: "successfully deleted",
        });
      }
      orderItem.price = orderItem.menu.price * orderItem.quantity;
      const updatedOrderItem = await orderItem.save();
      return ExpressResponse.success(res, { data: updatedOrderItem });
    } catch (error) {
      next(error);
    }
  }
}

const orderItemController = new OrderItemsController();
export default orderItemController;
