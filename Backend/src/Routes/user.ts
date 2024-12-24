
import express  from "express";
import {deleteUser, getAllUsers, getUser, newUser} from "../Controllers/user.js";
import { adminOnly } from "../middleware/auth.js";
//import { adminOnly } from "../middlewares/auth.js";
 
const app = express.Router();

// route - /api/v1/user/new
//app.post("/new", newUser);
console.log("✅ User routes loaded");
app.post("/new", (req, res, next) => {
    console.log("✅ Route /api/v1/user/new hit");
    next();
  }, newUser);
  
// Route - /api/v1/user/all
 app.get("/all" , adminOnly , getAllUsers);
// Route - /api/v1/user/dynamicID
app.get("/:id",adminOnly, getUser);
app.delete('/:id' , adminOnly ,deleteUser)

export default app;