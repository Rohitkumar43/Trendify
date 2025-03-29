import express from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../Controllers/user.js";
import { adminOnly, authenticate } from "../middleware/auth.js";

const app = express.Router();

console.log("✅ User routes loaded");

// Public routes (no auth needed)
app.post("/new", (req, res, next) => {
  console.log("✅ Route /api/v1/user/new hit");
  next();
}, newUser);

// User routes (needs authentication)
app.get("/:id", authenticate, getUser);

// Admin routes (needs admin role)
app.get("/all", adminOnly, getAllUsers);
app.delete('/:id', adminOnly, deleteUser);

export default app;