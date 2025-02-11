import ExpressError from "../common/error.js";
import { ExpressResponse } from "../common/success.handler.js";
import Table from "../model/table.model.js";

class TableController {
  async getAll(req, res, next) {
    try {
      const responseTable = await Table.find().lean();
      return ExpressResponse.success(res, {
        data: responseTable,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const table = await Table.findById(id).lean();
      return ExpressResponse.success(res, { data: table });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { table_number, capacity } = req.body;
      const newTable = await Table.create({ table_number, capacity });
      await newTable.save();
      return ExpressResponse.success(res, { data: newTable });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { table_number, capacity } = req.body;
      let table = await Table.findById(id) ;
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

  async toogleReserveTable(req, res, next) {
    try {
      const { id } = req.params;
       let table = await Table.findById(id) ;
      if (!table) {
        throw new ExpressError(404, "Table not found");
      }
      table.isReserved = !table.isReserved;
      const updatedTable = await table.save();
      return ExpressResponse.success(res, { data: updatedTable });
    } catch (error) {
      next(error);
    }
  }
}

const tableController = new TableController();
export default tableController;
