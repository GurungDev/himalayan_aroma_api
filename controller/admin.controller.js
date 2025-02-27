import ExpressError from "../common/error.js";
import { ExpressResponse } from "../common/success.handler.js";
import Menu from "../model/menu.model.js";
import Staff from "../model/staff.model.js";
import Table from "../model/table.model.js";

class AdminController {
  async activateStaff(req, res, next) {
    try {
      const { id } = req.params;
      const staff = await Staff.findById(id);
      if (!staff) {
        throw new ExpressError(404, "Staff not found");
      }
      staff.status = !staff.status;
      await staff.save();
      return ExpressResponse.success(res, { data: staff });
    } catch (error) {
      next(error);
    }
  }

  async getDashboardInfo(req, res, next) {
    try {
      const [totalStaff, activeStaff, inActiveStaff] = await Promise.all([
        Staff.countDocuments({}),
        Staff.countDocuments({ status: true }),
        Staff.countDocuments({ status: false }),
      ]);

      const [
        totalMenuItems,
        specialMenuItems,
        unavailableMenuItems,
        availableMenuItems,
      ] = await Promise.all([
        Menu.countDocuments({}),
        Menu.countDocuments({ isSpecial: true }),
        Menu.countDocuments({ isAvailable: false }),
        Menu.countDocuments({ isAvailable: true }),
      ]);

      const [totalTables, reservedTables, avaoilableTables, unreservedTables] =
        await Promise.all([
          Table.countDocuments({}),
          Table.countDocuments({ isReserved: true }),
          Table.countDocuments({ isReserved: false }),
          Table.countDocuments({ status: "INACTIVE" }),
        ]);

      return ExpressResponse.success(res, {
        data: [
          {
            title: "Table Info",
            data: [
              { title: "Total Number of tables.", number: totalTables },
              { title: "Number of reserved tables.", number: reservedTables },
              {
                title: "Number of available tables.",
                number: avaoilableTables,
              },
              { title: "Number of inactive tables.", number: unreservedTables },
            ],
          },

          {
            title: "Menu Info",
            data: [
              { title: "Total Number of menu items.", number: totalMenuItems },
              {
                title: "Number of special menu items.",
                number: specialMenuItems,
              },
              {
                title: "Current Number of available menu items.",
                number: availableMenuItems,
              },
              {
                title: "Current Number of unavailable menu items.",
                number: unavailableMenuItems,
              },
            ],
          },

          {
            title: "Staff Info",
            data: [
              { title: "Total Number of staff.", number: totalStaff },
              { title: "Number of active staff.", number: activeStaff },
              { title: "Number of inactive staff.", number: inActiveStaff },
            ],
          },
        ],
      });
    } catch (error) {
      next(error);
    }
  }
}

const adminController = new AdminController();
export default adminController;
