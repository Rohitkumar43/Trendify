import express, { Request, Response, NextFunction } from "express";
import { adminOnly, authenticate } from "../middleware/auth.js";
import { deleteUser, getAllUsers, getUser, newUser } from "../Controllers/user.js";

const app = express.Router();

console.log("✅ User routes loaded");

// Public routes (no auth needed)
app.post("/new", (req: Request, res: Response, next: NextFunction) => {
  console.log("✅ Route /api/v1/user/new hit");
  next();
}, newUser);

// User routes (needs authentication)
app.get("/:id", authenticate, (req: Request, res: Response, next: NextFunction) => getUser(req, res, next));

// Admin routes (needs admin role)
app.get("/all", adminOnly, (req: Request, res: Response, next: NextFunction) => getAllUsers(req, res, next));
app.delete('/:id', adminOnly, (req: Request, res: Response, next: NextFunction) => deleteUser(req, res, next));

export default app;