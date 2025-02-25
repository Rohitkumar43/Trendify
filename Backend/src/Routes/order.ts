import express from "express";
import { adminOnly } from "../middleware/auth.js";
import { allOrderByAdmin, deleteOrder, getSingleOrder, myAllOrder, newOrder, processingOrder } from "../Controllers/order.js";
//import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();


// create the [product]
app.post('/new', newOrder);
// get all my order by the user 
app.get('/myorder' , myAllOrder);

// get all the order list by the admin 
app.get('/allorderAdmin' , adminOnly , allOrderByAdmin);

// to get order of the single product 
app.route('/:id').get(getSingleOrder);

// all the route processedireder , delete order 

app.route('/:id').get(adminOnly , processingOrder).get(adminOnly , deleteOrder);



export default app;