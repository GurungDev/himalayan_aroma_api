import cors from "cors";
import express from "express";
import morgan from "morgan";
import errorMiddleware from "./middleware/error.middleware.js";
import ExpressError from "./common/error.js";
 

export default function himalayanAroma() {
  const app = express();

  app.use(cors());
  app.use(morgan("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
 
 
  app.use("*", (req, res, next) => {
    try {
      throw new ExpressError(404, "Not found");
    } catch (error) {
      next(error);
    }
  });

  app.use(errorMiddleware);

  return app;
}
