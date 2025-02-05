import ExpressError from "../common/error";
import paginationInfo from "../common/paginationInfo";
import { ExpressResponse } from "../common/success.handler";
import Menu from "../model/menu.model";

class MenuController {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const { name, isSpecial, isAvailable } = req.body;
      const skip = (page - 1) * limit;
      const query = {};
      if (name) query.name = name;
      if (isSpecial) query.isSpecial = isSpecial;
      if (isAvailable) query.isAvailable = isAvailable;
      const [responseMenu, countMenu] = await Promise.all([
        Menu.find(query).limit(limit).skip(skip).lean(),
        Menu.count(),
      ]);
      return ExpressResponse.success(res, {
        data: responseMenu,
        pagination: paginationInfo(countMenu, limit, page),
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const menu = await Menu.findById(id).lean();
      return ExpressResponse.success(res, { data: menu });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res) {
    try {
      const { name, price, description, isSpecial = false } = req.body;
      if (!name || !price) {
        throw new ExpressError(400, "All fields are required");
      }
      const newMenu = await Menu.create({
        name,
        price,
        description,
        isSpecial,
      });
      return ExpressResponse.success(res, { data: newMenu });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price, description, isSpecial } = req.body;
      let menu = await Menu.findById(id).lean();
      if (!menu) {
        throw new ExpressError(404, "Menu item not found");
      }
      menu.name = name || menu.name;
      menu.price = price || menu.price;
      menu.description = description || menu.description;
      menu.isSpecial = isSpecial || menu.isSpecial;
      const updatedMenu = await menu.save();
      return ExpressResponse.success(res, { data: updatedMenu });
    } catch (error) {
      next(error);
    }
  }
}

const menuController = new MenuController();
export default menuController;
