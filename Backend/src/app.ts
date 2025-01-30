import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import connectDB from "./utils/dbconnect.js";
import dotenv from "dotenv";
import userRoute from "./Routes/user.js";
import productRoute  from './Routes/products.js'
import NodeCache from "node-cache";
dotenv.config();


export const myCache = new NodeCache();
const app = express();
const port = process.env.PORT || 4000;



// ✅ Middleware
app.use(express.json());

// ✅ Request Logging Middleware for Debugging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📥 Incoming Request: ${req.method} ${req.url}`);
  if (Object.keys(req.body).length) {
    console.log(`📦 Request Body:`, req.body);
  }
  next();
});

// ✅ API Endpoints
console.log("✅ User routes loaded");
app.use('/api/v1/user', userRoute);
app.use('/api/v1/product' , productRoute);

// ✅ Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Global Error Handler Triggered:");
  console.error(`Error Message: ${err.message}`);
  console.error(`Stack Trace: ${err.stack}`);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});



// ✅ Start Server with Database Connection
const startServer = async () => {
  try {
    await connectDB(); // ✅ Properly calling the connectDB function
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error);
    process.exit(1);
  }
};

// Start the Server
startServer();
