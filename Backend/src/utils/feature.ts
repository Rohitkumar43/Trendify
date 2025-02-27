import { NextFunction } from "express";
import { myCache } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/product.js";
import { InvalidateCacheProps, OrderItemType } from "../Types/types.js";
import { Order } from "../models/order.js";


// Here we make use of the cache to store the data and invalidate the cache when needed
// fxn for the invalidate cache 
export const invalidateCache = async ({ product, order, admin , userId , orderId , productId}: InvalidateCacheProps) => {
    if (product) {
        const productKeys: string[] = ["latest-product",
             "all-categories", 
             "all-admin-products" ,
            `product-${productId}`
            ];
        myCache.del(productKeys);
        // here we will delete the cache for the single product
        //which will used this one `product-${productId}`

        // get the id
        // When you update a product:
        // 1. "latest-product" is cleared (handled by initial productKeys)
        // 2. Individual product caches need clearing too (handled by this code)
        // const products = await Product.find({}).select('_id');

        // products.forEach((i) => {
        //     productKeys.push(`product-${i._id}`);
        // })
    }
    if (order) {
        const orderKeys: String[] = ['all-order-ByAdmin' , `my-orders-${userId}` , `order-${orderId}`];
         const order = await Order.find({}).select("_id");

        myCache.del(`order-${order}`);
    }
    if (admin) {
        myCache.del(`admin-${admin}`);
    }
};



// fxn to reduce the stalk


export const reduceStock = async(orderItems: OrderItemType[]) => {
    for (let i = 0; i < orderItems.length ; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);

        if(!product){
            throw new Error("Product not found")
        }

        product.stock -= order.quantity;
        await product.save();
        
    }
}

// percentage fxn to shoe it on the ui 

export const calculatePercentage = (thisMonth: Number , lastMonth: Number) =>  {
    


}