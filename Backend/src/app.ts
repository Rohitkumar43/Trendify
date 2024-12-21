import express from "express";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 4000;



app.listen(port, () => {
    console.log(`Express is working on http://localhost:${port}`);
  });