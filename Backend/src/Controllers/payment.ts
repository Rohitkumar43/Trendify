import { NextFunction, Request, Response } from "express"
import { TryCatch } from "../middleware/error.js"
import ErrorHandler from "../utils/utility-class.js";
import {Coupon} from "../models/coupan.js";
import { stripe } from "../app.js";

// STRIPE PAYMENT INTENT 

// export const  createPaymentIntent = TryCatch(async (req , res , next  ) => {

//     const {amount} = req.body;

//     if(!amount){
//         return next (new ErrorHandler("Please enter the coupan code " , 400))
//     }

//     console.log("get the payment");

//     const paytmentIntent = await stripe.paymentIntents.create({
//         amount: Number(amount ) * 100,
//         currency: "inr"
//     })

//     res.status(201).json({
//         success: true,
//         clientSecret: paytmentIntent.client_secret
//     })
// })


export const createPaymentIntent = TryCatch(async (req, res, next) => {
    console.log("createPaymentIntent called");
    console.log("Request body:", req.body);

    const { amount } = req.body;

    if (!amount) {
        console.log("No amount provided");
        return next(new ErrorHandler("Please provide an amount", 400));
    }

    try {
        console.log("Creating payment intent");
        const amountInPaise = Number(amount) * 100; // Convert to smallest currency unit

        console.log("Amount to charge:", amountInPaise);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaise,
            currency: "inr",
            // Optional: Add more configuration if needed
            // payment_method_types: ['card'], 
        });

        console.log("Payment intent created successfully");
        console.log("Payment intent details:", {
            id: paymentIntent.id,
            client_secret: paymentIntent.client_secret
        });

        res.status(201).json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error("Detailed Stripe Error:", error);
        
        // More specific error handling
        if (error instanceof stripe.errors.StripeError) {
            console.error("Stripe Error Type:", error.type);
            console.error("Stripe Error Code:", error.code);
            console.error("Stripe Error Param:", error.param);
        }

        next(error);
    }
});


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
