import e from "express";
import ExpressError from "../common/error";
import { userRole } from "../common/object";
import { ExpressResponse } from "../common/success.handler";
import Admin from "../model/admin.model";
import Staff from "../model/staff.model";
import { CreateJWT } from "../utils/jwtToken";
import { hashString } from "../utils/hash";

class UserService {
  async login(req, res) {
    try {
      const { email, password, role } = req.body;
      switch (role) {
        case userRole.ADMIN:
          const admin = await Admin.findOne({ email });
          if (admin) {
            if (admin.password === hashString(password)) {
              const token = CreateJWT({ id: admin._id, email: admin.email, role: userRole.ADMIN });
              return ExpressResponse.success(res, {
                message: "Login successfully",
                data: { token },
                statusCode: 200,
              });
            } else {
              throw new ExpressError(404, "Invalid credentials");
            }
          } else {
            throw new ExpressError(404, "Admin not found");
          }
          break;
        case userRole.STAFF:
          const staff = await Staff.findOne({ email });
          if (staff) {
            if(staff.status === "INACTIVE") throw new ExpressError(400, "Staff is inactive.");
            if (staff.password === hashString(password)) {
              const token = CreateJWT({
                id: staff._id,
                email: staff.email,
                name: staff.firstName + " " + staff.lastName,
                role: userRole.STAFF,
              });
              return ExpressResponse.success(res, {
                message: "Login successfully",
                data: { token },
                statusCode: 200,
              });
            } else {
              throw new ExpressError(404, "Invalid credentials");
            }
          } else {
            throw new ExpressError(404, "Staff not found");
          }
          break;
        default:
          throw new ExpressError(400, "Invalid role");
      }
    } catch (error) {
      next(error);
    }
  }

  async staffRegister(req, res) {
    try {
      const { email, password, role } = req.body;

      const staff = await Staff.findOne({ email });
      if (staff) {
        throw new ExpressError(400, "Staff already exists");
      } else {
        const newStaff = new Staff({ email, password: hashString(password), role });
        await newStaff.save();
        return ExpressResponse.success(res, {
          message: "Staff registered successfully",
          statusCode: 201,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

const userService = new UserService();
export default userService;
