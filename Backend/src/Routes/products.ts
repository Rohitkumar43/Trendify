import express  from "express";
import {deleteUser, getAllUsers, getUser, newUser} from "../Controllers/user.js";
import { adminOnly } from "../middleware/auth.js";
import { newProduct } from "../Controllers/products.js";
//import { adminOnly } from "../middlewares/auth.js";
 
const app = express.Router();


// create the [product]
app.post('/new' , newProduct )



export default app;