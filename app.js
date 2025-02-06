import cors from "cors";
import express from "express";
import morgan from "morgan";
import errorMiddleware from "./middleware/error.middleware.js";
import ExpressError from "./common/error.js";
import allRoutes from "./route/index.js";

export default function himalayanAroma() {
  const app = express();

  app.use(cors());
  app.use(morgan("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api",allRoutes);

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
