import ExpressError from "./error.js";

export class ExpressResponse {
  constructor() {
    throw new ExpressError(400, "Can't instantiate ExpressResponse Class");
  }

  static success(
    res,
    {
      status = 200,
      message = "Success",
      data = {},
      pagination = undefined,
    } = {}
  ) {
    return res.status(status).json({
      success: true,
      message,
      data,
      pagination,
    });
  }
}
