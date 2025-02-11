import ExpressError from "../common/error.js";
import { userRole } from "../common/object.js";
import paginationInfo from "../common/paginationInf.js";
import { ExpressResponse } from "../common/success.handler.js";
import Staff from "../model/staff.model.js";
import { hashString } from "../utils/hash.js";

class staffController {
  async getAll(req, res, next) {
    try {
      const { role, status, name } = req.query;
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;
      const query = {};
      if (role) query.role = role;
      if (status) query.status = status;
      if (name) query.name = name;

      const [responseStaff, countStaff] = await Promise.all([
        Staff.find(query).limit(limit).skip(skip).sort("-updatedAt").lean(),
        Staff.count(query),
      ]);

      return ExpressResponse.success(res, {
        data: responseStaff,
        pagination: paginationInfo(countStaff, limit, page),
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const staff = await Staff.findById(id).lean();
      return ExpressResponse.success(res, { data: staff });
    } catch (error) {
      next(error);
    }
  }

  async getByEmail(req, res, next) {
    try {
      const { email } = req.params;
      const staff = await Staff.findOne({ email }).lean();
      return ExpressResponse.success(res, { data: staff });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      let hashedPassword;
       let staff = await Staff.findById(id).lean();

      if (!staff) {
        throw new ExpressError(404, "Staff not found");
      }
      staff.firstName = req.body.firstName || staff.firstName;
      staff.lastName = req.body.lastName || staff.lastName;

      if (req.body.email) {
        if (await Staff.findOne({ email: req.body.email })) {
          throw new ExpressError(400, "Email already exists");
        }
        staff.email = req.body.email;
      }
      if (req.body.password) {
        hashedPassword = hashString(req.body.password);
        staff.password = hashedPassword;
      }
      if (req.body.role) {
        if (!userRole[req.body.role]) {
          throw new ExpressError(400, "Invalid role");
        }
        staff.role = req.body.role;
      }
      if (req.body.status) {
        if(req.user.role != userRole.ADMIN){
            throw new ExpressError(400, "You are not permitted to perform this action");
        }
        if (typeof req.body.status !== Boolean) {
          throw new ExpressError(400, "Invalid status");
        }
        staff.status = req.body.status;
      }
      const updatedstaff = await staff.save();
      return ExpressResponse.success(res, { data: updatedstaff });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const staff = await Staff.findByIdAndDelete(id).lean();
      return ExpressResponse.success(res, { data: staff });
    } catch (error) {
      next(error);
    }
  }

 
}

const staffController = new staffController();
export default staffController;
