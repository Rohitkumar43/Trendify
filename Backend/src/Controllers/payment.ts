import { NextFunction, Request, Response } from "express"
import { TryCatch } from "../middleware/error.js"
import ErrorHandler from "../utils/utility-class.js";
import {Coupon} from "../models/coupan.js";
import { stripe } from "../app.js";

// STRIPE PAYMENT INTENT 

export const  createPaymentIntent = TryCatch(async (req , res , next  ) => {

    const {amount} = req.body;

    if(!amount){
        return next (new ErrorHandler("Please enter the coupan code " , 400))
    }

    const paytmentIntent = await stripe.paymentIntents.create({
        amount: Number(amount ) * 100,
        currency: "inr"
    })

    res.status(201).json({
        success: true,
        clientSecret: paytmentIntent.client_secret
    })
})





// forr the couappan creation 
export const  newCoupon= TryCatch(async (req , res , next  ) => {

    const {coupan , amount} = req.body;

    if(!coupan || !amount){
        return next (new ErrorHandler("Please enter the coupan code " , 400))
    }

    await Coupon.create({
        coupanCode: coupan,
        amount
    });

    res.status(201).json({
        success: true,
        message: `coupan ${coupan} is created successfully`
    })
})

// for the discount 

export const  applieddDiscount= TryCatch(async (req , res , next  ) => {

    const {coupan} = req.query; // it means i have to sent the couoan in the url as a query
    const discount = await Coupon.findOne({coupanCode: coupan});

    if(!discount){
        return next (new ErrorHandler(" Inavlid coupan code " , 400))
    }

    res.status(201).json({
        success: true,
        discount: discount.amount
    })
});


// now fxn where admin cam check all the avaible coupan 

export const avaibleCoupanByAdmin = TryCatch(async(req , res , next) => {
    const coupan = await Coupon.find({});

    res.status(201).json({
        success: true,
        coupan
    });
})


// to delte the coupan 

export const deleteCoupan = TryCatch(async(req , res , next ) => {
    const { id } = req.params
    await Coupon.findByIdAndDelete({id});

    res.status(201).json({
        success: true,
        message: "Cpupan is deleted succesfully"
    });
})
