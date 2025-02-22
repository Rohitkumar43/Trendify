import express from "express";
import { adminOnly } from "../middleware/auth.js";
import { newOrder } from "../Controllers/order.js";
//import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();


// create the [product]
app.post('/new', newOrder)



export default app;