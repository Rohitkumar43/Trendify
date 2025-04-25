import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
import { Request } from "express";

// Extend Request type to include user
interface IUser {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
}

interface AuthRequest extends Request {
  user?: IUser;
}

// Middleware to check if user is authenticated
export const authenticate = TryCatch(async (req: AuthRequest, res, next) => {
  // Check for ID in query params or route params
  const id = req.query.id || req.params.id;
  
  if (!id || typeof id !== 'string') return next(new ErrorHandler("Please login first", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid user ID", 401));

  req.user = user.toObject();
  next();
});

// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req: AuthRequest, res, next) => {
  // Check for ID in query params or route params
  const id = req.query.id || req.params.id;
  
  if (!id || typeof id !== 'string') return next(new ErrorHandler("Please login first", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid user ID", 401));
  if (user.role !== "admin")
    return next(new ErrorHandler("Admin access required", 403));

  req.user = user.toObject();
  next();
});