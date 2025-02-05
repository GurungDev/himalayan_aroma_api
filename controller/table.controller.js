import ExpressError from "../common/error";
import { ExpressResponse } from "../common/success.handler";
import Table from "../model/table.model";

class TableController {
  async getAll(req, res) {
    try {
      const responseTable = await Table.find().lean();
      return ExpressResponse.success(res, {
        data: responseTable,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const table = await Table.findById(id).lean();
      return ExpressResponse.success(res, { data: table });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res) {
    try {
      const { table_number, capacity } = req.body;
      const newTable = await Table.create({ table_number, capacity });
      return ExpressResponse.success(res, { data: newTable });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { table_number, capacity } = req.body;
      let table = await Table.findById(id).lean();
      if (!table) {
        throw new ExpressError(404, "Table not found");
      }
      table.table_number = table_number || table.table_number;
      table.capacity = capacity || table.capacity;
      const updatedTable = await table.save();
      return ExpressResponse.success(res, { data: updatedTable });
    } catch (error) {
      next(error);
    }
  }
}

const tableController = new TableController();
export default tableController;
