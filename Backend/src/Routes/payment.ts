import express from "express";
import { applieddDiscount, avaibleCoupanByAdmin, createPaymentIntent, deleteCoupan, newCoupon } from "../Controllers/payment.js";
import { adminOnly } from "../middleware/auth.js";

const app = express.Router();

// create the payment intent 
app.get('/create' , createPaymentIntent)
// create the coupan
app.post('/coupan/new', newCoupon);
// check the discount 
app.get('/discount' , applieddDiscount);

// to check all avaivlbe discount from the admin 
app.get('/coupan/allcoupan' , adminOnly , avaibleCoupanByAdmin)

// deelte the coupan 
app.delete('/coupan/:id' , adminOnly , deleteCoupan)


export default app;