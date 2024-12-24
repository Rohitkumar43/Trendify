import express  from "express";
import {deleteUser, getAllUsers, getUser, newUser} from "../Controllers/user.js";
import { adminOnly } from "../middleware/auth.js";
import { deleteProduct, getAllAdminProduct, getAllCategoriesProduct, getLatestProduct, getSingleProduct, newProduct, updateProduct } from "../Controllers/products.js";
import { singlePicUpload } from "../middleware/multer.js";
import { get } from "http";
//import { adminOnly } from "../middlewares/auth.js";
 
const app = express.Router();


// create the [product]
app.post('/new' , adminOnly , singlePicUpload , newProduct )
// GET THE LATEST PRDS 
app.get('/latestproduct' , getLatestProduct);
// get all the categories prds
app.get('/allcategories' , getAllCategoriesProduct)
// get all the admin products so that we can search it and in this only pagination 
// will work and all the product get filter acc to tge property

app.get('/admin-prd' , getAllAdminProduct);
// to get single prd
app.get('/singleprd' , getSingleProduct);
// to update and delete the product 
app.route(':id/').get(getSingleProduct).put(singlePicUpload , updateProduct).delete(deleteProduct)









export default app;