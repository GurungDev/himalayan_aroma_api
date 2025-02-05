import ExpressError from "../common/error.js";
import Admin from "../model/admin.model.js";
import Staff from "../model/staff.model.js";
import { verifyJWT } from "../utils/jwtToken.js";
 
export async function authorization(req, res, next) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new ExpressError(400, "You are not permitted to access");
    const checkToken = verifyJWT(token);
    if (!checkToken) throw new ExpressError(400, "You are not authorized");
    const isAdminUser = await Admin.findOne({ email: checkToken.email });
    if (isAdminUser) {
      req.user = { id: checkToken.id, email: checkToken.email, role: checkToken.ADMIN };
      next();
    }
    const isUser = await Staff.findOne({ email: checkToken.email });
    if (isUser) {
      req.user = { id: checkToken.id, email: checkToken.email, role: checkToken.STAFF };
      next();
    }
    throw new ExpressError(400, "User not found")  
  } catch (error) {
    next(error);
  }
}


