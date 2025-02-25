import { rm } from "fs";
import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/product.js";
import { BaseQuery, NewOrderRequestBody, NewProductRequestBody, SearchRequestQuery } from "../Types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Request, Response, NextFunction, response } from "express";
import { myCache } from "../app.js";
import { invalidateCache, reduceStock } from "../utils/feature.js";
import { Order } from "../models/order.js";
import { User } from "../models/user.js";



export const newOrder = TryCatch(async (req: Request<{}, {}, NewOrderRequestBody>, res: Response, next: NextFunction) => {
    // create the oreder  and save it in the db
    // get all the varible from the body
    const { orderItems, shippingInfo, user, subtotal, tax, shippingCharges, discount, total } = req.body;

    // check if the order item is there or not
    if (orderItems && orderItems.length === 0) {
        return next(new ErrorHandler('No order items', 400))
    }


    if (!orderItems || !shippingInfo || !user || !subtotal || !tax || !shippingCharges || !discount || !total) {
        return next(new ErrorHandler("PLEASE enter all the fields", 400))
    };

    // creater the order 
    const order = await Order.create({
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

    await invalidateCache({ product: true, order: true, admin: true , userId: user });

    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order
    })

});

// getting all my all order 

export const myAllOrder = TryCatch(async (req, res, next) => {
    // Get the user ID from query parameters
    const { id: user } = req.query;

    const key = `my-orders${user}`;

    let orders = [];

    // Check if orders are cached
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key) as string);
    } else {
        orders = await Order.find({ user }); // Assuming Order is a Mongoose model
        myCache.set(key, JSON.stringify(orders));
    }

    res.status(200).json({
        success: true,
        message: 'you retrived all orders scuccesfully',
        orders, // Return the fetched orders
    });
});

// ALL THE ORDERS CHECKD BY THE ADMIN 

export const allOrderByAdmin = TryCatch(async (req, res, next) => {

    const key = 'all-order-ByAdmin';

    let orders = [];

    // Check if orders are cached
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key) as string);
    } else {
        orders = await Order.find().populate("user", "name"); // Assuming Order is a Mongoose model
        myCache.set(key, JSON.stringify(orders));
    }

    res.status(200).json({
        success: true,
        message: 'This is the all the order list ',
        orders, // Return the fetched orders
    });
});

// TO GET THE ORDER FROM THE SINGLE PRODUCT 

export const getSingleOrder = TryCatch(async (req, res, next) => {
    // Get the user ID from query parameters
    const { id: user } = req.query;

    const key = `single-order${user}`;

    let orders; // no need to take array as i want only the single prosuct 

    // Check if orders are cached
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key) as string);
    } else {
        orders = await Order.find().populate("user", "name"); // Assuming Order is a Mongoose model

        // if there is not order

        if (!orders) {
            return next(new ErrorHandler("Order is not found", 401));
        }

        myCache.set(key, JSON.stringify(orders));
    }

    res.status(200).json({
        success: true,
        message: 'you retrived all orders scuccesfully',
        orders, // Return the fetched orders
    });
});


// to processed the order witht he user id 

export const processingOrder = TryCatch(async (req, res, next) => {

    // take the id
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) return next(new ErrorHandler("Order not found ", 400));

    // use the swtich case method to ge the diff vaiation also we can use the if else 

    switch (order.status) {
        case "Processing":
            order.status = "Shipped";
            break;

        case "Shipped":
            order.status = 'Delivered';
            break;

        default:
            order.status = 'Delivered';
            break;
    }

    // sae it 

    await order.save();
    await invalidateCache({ product: false, order: true, admin: true , userId: order.user });

    res.status(201).json({
        success: true,
        message: 'Order processed  successfully',
        order
    })

});


// to delete thr order of the user 

export const deleteOrder = TryCatch(async (req, res, next) => {

    // take the id
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) return next(new ErrorHandler("Order not found ", 400));


    await order.deleteOne();
    await invalidateCache({ product: false, order: true, admin: true  , userId: order.user , orderId: String(order._id) , });

    res.status(201).json({
        success: true,
        message: 'Order deletet successfully',
        order
    })

});






// delete order

// update the order 


