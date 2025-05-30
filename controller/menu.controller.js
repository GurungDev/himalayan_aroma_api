import ExpressError from "../common/error.js";
import paginationInfo from "../common/paginationInfo.js";
import { ExpressResponse } from "../common/success.handler.js";
import Menu from "../model/menu.model.js";

class MenuController {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 20, name, isSpecial, isAvailable } = req.query;
      const skip = (page - 1) * limit;
      const query = {};

      if (name) {
        query.name = { $regex: name, $options: "i" }; // Case-insensitive partial match
      }
      if (isSpecial) query.isSpecial = isSpecial;
      if (isAvailable) query.isAvailable = isAvailable;

      const [responseMenu, countMenu] = await Promise.all([
        Menu.find(query).limit(limit).skip(skip).lean(),
        Menu.countDocuments(query), // Apply query to count total documents
      ]);

      return ExpressResponse.success(res, {
        data: responseMenu,
        pagination: paginationInfo(countMenu, limit, page),
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const menu = await Menu.findById(id).lean();
      return ExpressResponse.success(res, { data: menu });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { name, price, image, description, isSpecial = false } = req.body;

       if (!name || !price || !image || !description) {
        throw new ExpressError(400, "All fields are required");
      }
      if (await Menu.findOne({ name })) {
        throw new ExpressError(400, "Menu item already exists");
      }
      const newMenu = await Menu.create({
        name,
        price,
        description,
        image,
        isSpecial,
      });

      await newMenu.save();
      return ExpressResponse.success(res, { data: "Done" });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, price, description, image, isSpecial, isAvailable } = req.body;
      let menu = await Menu.findById(id);
      if (!menu) {
        throw new ExpressError(404, "Menu item not found");
      }
      menu.name = name || menu.name;
      menu.price = price || menu.price;
      menu.description = description || menu.description;
      menu.isSpecial = isSpecial !== null ? isSpecial : menu.isSpecial;
      menu.isAvailable = isAvailable !== null ? isAvailable : menu.isAvailable;
      menu.image = image || menu.image;
      const updatedMenu = await menu.save();
      return ExpressResponse.success(res, { data: updatedMenu });
    } catch (error) {
      next(error);
    }
  }
}

const menuController = new MenuController();
export default menuController;
