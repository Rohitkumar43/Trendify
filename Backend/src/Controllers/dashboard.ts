
// all the code og the dasbgord and all the fxn 

import { myCache } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/feature.js";


export const dashbordStats = TryCatch(async( req , res , next) => {
    let stats ={};

    if (myCache.has("admin-stats")) {

        stats = JSON.parse(myCache.get("admin-stats") as string)
        
    } else {
        // get the curret month and the last month this is for the percentage of the 
        // which will be shown in the dashbord 

        const today = new Date();

        const thisMonth = {
            start: new Date(today.getFullYear() , today.getMonth() , 1),
            end: today
        }

        const lastMonth = {
            start: new Date(today.getFullYear() , today.getMonth() - 1 , 1),
            end: new Date(today.getFullYear() , today.getMonth() , 0)
        }

        // now invlove this with the product 

        const thisMonthProductPromise = Product.find({
            createdAt: {
                $get: thisMonth.start,
                $lte: thisMonth.end
            }
        });

        // get the all product of the last month

        const lastMonthProductPromise = Product.find({
            createdAt: {
                $get: lastMonth.start,
                $lte: lastMonth.end
            }
        });

        // NOW FOR THE USER THIS MONTH ASND THE LAST MONTH 

        const thisMonthUserPromise =User.find({
            createdAt: {
                $get: thisMonth.start,
                $lte: thisMonth.end
            }
        });

        // get the all user of the last month

        const lastMonthUserPromise = User.find({
            createdAt: {
                $get: lastMonth.start,
                $lte: lastMonth.end
            }
        });

        // NOW FOR THE ORDER 

        const thisMonthOrderPromise =Order.find({
            createdAt: {
                $get: thisMonth.start,
                $lte: thisMonth.end
            }
        });

        // get the all order of the last month

        const lastMonthOrderPromise = Order.find({
            createdAt: {
                $get: lastMonth.start,
                $lte: lastMonth.end
            }
        });

        // RETUERN ALL THE PROMISE 

        const [
            thismonthProduct,
            thisMonthOrder,
            thisMonthUser,
            lastMonthProduct,
            lastMonthOrder,
            lastMonthUser
            
        ] = await Promise.all([
            thisMonthProductPromise,
            thisMonthUserPromise,
            thisMonthOrderPromise,
            lastMonthProductPromise,
            lastMonthUserPromise,
            lastMonthOrderPromise,
        ]);

        // now use the percentage in the every segment product , user , order 

        const userChangePercent = calculatePercentage(
            thisMonthUser.length,
            lastMonthUser.length
        )

        const productChangePercent = calculatePercentage(
            thismonthProduct.length,
            lastMonthProduct.length
        )


        const orderChangePercent = calculatePercentage(
            thisMonthOrder.length,
            lastMonthOrder.length
        )




        

        






       
        
    }

    return res.status(200).json({
        success: true,
        stats
    });
});

// ===========for the barchart ====================

export const barChartStats = TryCatch(async( req , res , next) => {
    
});

// ============fro the pie chart ==================

export const pieChartStats = TryCatch(async( req , res , next) => {
    
});

// ============fro the line chart ==================

export const lineChartStats = TryCatch(async( req , res , next) => {
    
});