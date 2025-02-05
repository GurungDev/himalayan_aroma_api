import ExpressError from "../common/error.js";
import User from "../model/user.model.js";

async function checkIfUserExists(req, res, next) {
  try {
    if (!req?.user) {
      throw new ExpressError(401, `Not authenticated.`);
    }
    const existingUser = await User.findById(req?.user?._id);
    if (!existingUser) {
      throw new ExpressError(401, `Invalid user. Relogin`);
    }
    next();
  } catch (error) {
    next(error);
  }
}

export const authenticateUser = [checkIfUserExists];
