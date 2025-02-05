import multer from "multer";
import ExpressError from "../common/error.js";

export default function errorMiddleware(err, req, res, next) {
  console.log("error--------->>", err);
  if (err instanceof ExpressError) {
    if (err.getRedirectInfo()?.isRedirectable) {
      return res.redirect("/");
      return res.status(307).send({
        success: false,
        message: err.getMessage(),
        data: err.getData(),
      });
    }

    return res.status(err.getStatus()).send({
      success: false,
      message: err.getMessage(),
      data: err.getData(),
    });
  } else if (
    err instanceof multer.MulterError &&
    err.code === "LIMIT_FILE_SIZE"
  ) {
    return res.status(400).send({
      success: false,
      message: "File size too large.",
    });
  } else if (
    err instanceof multer.MulterError &&
    err.code === "LIMIT_UNEXPECTED_FILE"
  ) {
    return res.status(400).send({
      success: false,
      message: "Maximum image number exceeded.",
    });
  }

  return res.status(500).send({
    success: false,
    message: err?.message || "Something went wrong.",
  });
}
