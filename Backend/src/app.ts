import express from "express";
import mongoose from "mongoose";
import connectDB from "./utils/dbconnect.js";
import dotenv from "dotenv";

import userRoute from "./Routes/user.js"

dotenv.config();


const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// firs api end pints 

app.use('/api/v1/user' , userRoute)

app.listen (port, async() => {
  await connectDB;
    console.log(`Express is working on http://localhost:${port}`);
  });