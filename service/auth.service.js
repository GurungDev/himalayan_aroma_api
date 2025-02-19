import ExpressError from "../common/error.js";
import { OtpPurpose, userRole } from "../common/object.js";
import { ExpressResponse } from "../common/success.handler.js";
import Admin from "../model/admin.model.js";
import Staff from "../model/staff.model.js";
import { hashString } from "../utils/hash.js";
import { CreateJWT } from "../utils/jwtToken.js";
import emailSender from "./email/emailSender.js";
import otpService from "./otp.service.js";

class UserService {
  async login(req, res, next) {
    try {
      const { email, password, role } = req.body;
      switch (role) {
        case userRole.ADMIN:
          const admin = await Admin.findOne({ email }).select("+password");
          if (admin) {
            if (admin.password === hashString(password)) {
              const token = CreateJWT({
                id: admin._id,
                email: admin.email,
                role: userRole.ADMIN,
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
            throw new ExpressError(404, "Admin not found");
          }
          break;
        case userRole.STAFF:
          const staff = await Staff.findOne({ email }).select("+password");
          if (staff) {
            
            if (staff.status === false) {
              throw new ExpressError(400, "Staff is inactive.");
            } else if (staff.password === hashString(password)) {
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

  async staffRegister(req, res, next) {
    try {
      const { email, password, role, otp } = req.body;
      if (!email || !password || !role || !otp) {
        throw new ExpressError(400, "All fields are required");
      }
      const staff = await Staff.findOne({ email });
      if (staff) {
        throw new ExpressError(400, "Staff already exists");
      } else {
        await otpService.verifyOtp({
          purpose: OtpPurpose.REGISTER,
          otp,
          email,
        });
        const newStaff = new Staff({
          email,
          password: hashString(password),
          role,
        });
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

  async sendOtp(req, res, next) {
    try {
      const { email, purpose } = req.body;
      const staff = await Staff.findOne({ email });
      if (!purpose) {
        throw new ExpressError(400, "Invalid purpose");
      }
      if (!email) {
        throw new ExpressError(400, "Invalid email");
      }
      if (purpose === OtpPurpose.REGISTER && staff) {
        throw new ExpressError(400, "Staff already exists");
      }
      if (purpose === OtpPurpose.FORGOT_PASSWORD && !staff) {
        throw new ExpressError(400, "Staff not found");
      }
      const otp = await otpService.buildOtp(email, purpose);
      ExpressResponse.success(res, {
        message: "OTP sent successfully",
        data: otp?.otp,
      });
     if(purpose === OtpPurpose.REGISTER){
       await emailSender.verifyUserEmail(email, otp?.otp);
     }else if(purpose === OtpPurpose.FORGOT_PASSWORD){
       await emailSender.forgotPassword(email, otp?.otp);
     }
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email, otp, password } = req.body;
      if (!email || !otp || !password) {
        throw new ExpressError(400, "All fields are required");
      }
      await otpService.verifyOtp({ email, otp, purpose: OtpPurpose.FORGOT_PASSWORD });
      const staff = await Staff.findOne({ email });
      if (!staff) {
        throw new ExpressError(400, "Staff not found");
      }
      staff.password = hashString(password);
      await staff.save();
      return ExpressResponse.success(res, { message: "Password reset successfully" });
    } catch (error) {
      next(error);
    }
  }
}

const userService = new UserService();
export default userService;
