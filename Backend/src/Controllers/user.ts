import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../Types/types.js";
import { TryCatch } from "../middleware/error.js";
import ErrorHandler from "../utils/utility-class.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { name, email, photo, gender, _id, dob } = req.body;

    if (!_id || !name || !email || !photo || !gender || !dob) {
      return next(new ErrorHandler("Please add all fields", 400));
    }

    let user = await User.findById(_id);

    if (user) {
      // Return user data along with welcome message for existing users
      res.status(200).json({
        success: true,
        message: `Welcome back, ${user.name}`,
        user: user.toObject()
      });
      return;
    }

    try {
      user = await User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob: new Date(dob),
        role: "user"
      });

      res.status(201).json({
        success: true,
        message: `Welcome, ${user.name}`,
        user: user.toObject()
      });
    } catch (error) {
      return next(new ErrorHandler("Failed to create user", 500));
    }
  }
);

// get all the user 
export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    users: users.map(user => user.toObject()),
  });
});

// to get single user using dynamic id 
export const getUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    user: user.toObject(),
  });
});

// to delete the user through ID 
export const deleteUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findByIdAndDelete(id);

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});
