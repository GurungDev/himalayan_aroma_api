import ExpressError from "../common/error.js";
import { userRole } from "../common/object.js";
import Admin from "../model/admin.model.js";
import Staff from "../model/staff.model.js";
import { verifyJWT } from "../utils/jwtToken.js";
 
export async function authorization(req, res, next) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
     
    if (!token) throw new ExpressError(400, "You are not permitted to access");
    const checkToken = verifyJWT(token);
    if (!checkToken) throw new ExpressError(400, "You are not authorized");
    const { id, email, role } = checkToken;
 
    if (role === userRole.ADMIN) {
      const isAdminUser = await Admin.findOne({ email });
      if (!isAdminUser) throw new ExpressError(400, "User not found");
      req.user = { id, email, role };
      next();
    } else if (role === userRole.STAFF) {
      const isUser = await Staff.findOne({ email });
      if (!isUser) throw new ExpressError(400, "User not found");
      req.user = { id, email, role };
      next();
    } else {
      throw new ExpressError(400, "Invalid role");
    }
  } catch (error) {
    next(error);
  }
}


