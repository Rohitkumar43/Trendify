import express, { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import connectDB from "./utils/dbconnect.js";
import dotenv from "dotenv";
import userRoute from "./Routes/user.js";
import productRoute  from './Routes/products.js'
import NodeCache from "node-cache";
dotenv.config();
import  newOrder from "./Routes/order.js";
import  payment  from "./Routes/payment.js";
import cors from 'cors';


// now we will create the cache for the products  using the node cache which is a in memory cache  diff from the redis cache 
export const myCache = new NodeCache();


const port = process.env.PORT || 5000;
const stripeKey = process.env.STRIPE_KEY || " ";

// stripe 
export const stripe = new Stripe(stripeKey);
const app = express();


// ✅ Middleware
app.use(express.json());
app.use(cors());

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
app.use('/api/v1/order' , newOrder);
app.use('/api/v1/payment' , payment)

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
