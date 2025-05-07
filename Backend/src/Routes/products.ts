import express from "express";
import { adminOnly } from "../middleware/auth.js";
import {
    deleteProduct,
    getAdminProducts,
    getAllCategoriesProduct,
    getAllProducts,
    getLatestProduct,
    getSingleProduct,
    newProduct,
    updateProduct
} from "../Controllers/products.js";
import { singlePicUpload } from "../middleware/multer.js";
//import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();


// create the [product]
app.post('/new', adminOnly, singlePicUpload, newProduct)
// GET THE LATEST PRDS 
app.get('/latestproduct', getLatestProduct);
// to get all tge prd based on the filter nad the catefory 
app.get('/all', getAllProducts);
// get all the categories prds
app.get('/allcategories', getAllCategoriesProduct)
// get all the admin products so that we can search it and in this only pagination 
// will work and all the product get filter acc to tge property

app.get('/admin-prd/:id', adminOnly, getAdminProducts);
// to get single prd
app.get('/singleprd', getSingleProduct);
// to update and delete the product 
app.route(':id/').get(getSingleProduct).put(adminOnly, singlePicUpload, updateProduct)
    .delete(adminOnly, deleteProduct)



export default app;