import ExpressError from "../common/error.js";
import { ExpressResponse } from "../common/success.handler.js";
import Staff from "../model/staff.model.js";

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
}

const adminController = new AdminController();
export default adminController;
