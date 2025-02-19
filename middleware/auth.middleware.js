import ExpressError from "../common/error.js";

async function allowAdminOnly(req, res, next) {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      throw new ExpressError(400, "You are not authorized");
    }
    next();
  } catch (error) {
    next(error);
  }
}

 






export { allowAdminOnly };
