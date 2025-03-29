import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";

export type ControllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export const TryCatch = (func: ControllerFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
};