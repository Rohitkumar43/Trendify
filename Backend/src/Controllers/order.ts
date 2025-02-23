import { rm } from "fs";
import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/product.js";
import { BaseQuery, NewOrderRequestBody, NewProductRequestBody, SearchRequestQuery } from "../Types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Request, Response, NextFunction, response } from "express";
import { myCache } from "../app.js";
import { invalidateCache, reduceStock } from "../utils/feature.js";
import { Order } from "../models/order.js";



export const newOrder = TryCatch(async(req: Request<{} , {} , NewOrderRequestBody >  , res: Response , next: NextFunction) => {
 // create the oreder  and save it in the db
 // get all the varible from the body
 const {orderItems , shippingInfo , user , subtotal , tax , shippingCharges , discount , total } = req.body;

    // check if the order item is there or not
    if(orderItems && orderItems.length === 0){
        return next(new ErrorHandler('No order items',400))
    }

    // creater the order 
    const order =  await Order.create({
        orderItems,
        shippingInfo,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total
    });

    // now we have to all reduce the stock from the mai src
    // make a x=fxn in feature.ts

    await reduceStock(orderItems);

    await invalidateCache({ product: true  , order: true , admin: true});



    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order
    })

});



// get all the orders by the user 

// export const getMyorder = TryCatch(async(req: Request<{} , {} , {} > , res: Response , next: NextFunction) => {
//     // GET THE USER ID 
//     const userId = req.params.id;
//     // get all the orders by the user
//     const orders = await Order.find({user: userId});
//     res.status(200).json({
//         success: true,
//         message: 'All the orders by the user',
//         orders
//     })
// });


// delete order 

// update the order 


