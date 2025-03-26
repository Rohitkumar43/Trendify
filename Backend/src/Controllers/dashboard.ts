
import { myCache } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/feature.js";


export const dashbordStats = TryCatch(async(req, res, next) => {
    let stats = {};

    // Check if stats are already cached to avoid unnecessary database queries
    if (myCache.has("admin-stats")) {
        // If cached, retrieve and parse the stats from cache
        stats = JSON.parse(myCache.get("admin-stats") as string);
    } else {
        // If not cached, calculate all stats from scratch
        
        // Get current date for calculations
        const today = new Date();

        // FOR THE SIX MONTH VISUALIZATION IN THE GRAPH 
        // Create a date object for six months ago
        const setSixMonthAgo = new Date();
        setSixMonthAgo.setMonth(setSixMonthAgo.getMonth() - 6);

        // Define date ranges for this month (from 1st of current month to today)
        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today
        }

        // Define date ranges for last month (from 1st to last day of previous month)
        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0)
        }

        // PRODUCTS QUERIES
        // Find products created this month
        const thisMonthProductPromise = Product.find({
            createdAt: {
                $get: thisMonth.start, // NOTE: This is a typo, should be $gte
                $lte: thisMonth.end
            }
        });

        // Find products created last month  
        const lastMonthProductPromise = Product.find({
            createdAt: {
                $get: lastMonth.start, // NOTE: This is a typo, should be $gte
                $lte: lastMonth.end
            }
        });

        // USERS QUERIES
        // Find users created this month
        const thisMonthUserPromise = User.find({
            createdAt: {
                $get: thisMonth.start, // NOTE: This is a typo, should be $gte
                $lte: thisMonth.end
            }
        });

        // Find users created last month
        const lastMonthUserPromise = User.find({
            createdAt: {
                $get: lastMonth.start, // NOTE: This is a typo, should be $gte
                $lte: lastMonth.end
            }
        });

        // ORDERS QUERIES
        // Find orders created this month
        const thisMonthOrderPromise = Order.find({
            createdAt: {
                $get: thisMonth.start, // NOTE: This is a typo, should be $gte
                $lte: thisMonth.end
            }
        });

        // Find orders created last month
        const lastMonthOrderPromise = Order.find({
            createdAt: {
                $get: lastMonth.start, // NOTE: This is a typo, should be $gte
                $lte: lastMonth.end
            }
        });

        // For six month chart data - get all orders from six months ago until today
        const lastsixMonthOrdersPromise = Order.find({
            createdAt: {
                $get: setSixMonthAgo, // NOTE: This is a typo, should be $gte
                $lte: today
            }
        });


        // GET THE LATEST TRANSACTION...

        const latestTransactionPromise = Order.find({}).select(["total" , "orderItems" , "discount" , "status"]).limit(5);


        // Execute all promises concurrently for better performance
        const [
            thismonthProduct,
            thisMonthUser,         // There's a mismatch in the array order here compared 
            thisMonthOrder,        // to the Promise.all array below - be careful with the ordering
            lastMonthProduct,
            lastMonthUser,
            lastMonthOrder,
            // Count totals
            productcount,
            userCount,
            allOrdersCount,
            lastsixMonth,
            femaleCount,
            latestTransaction

            
        ] = await Promise.all([
            thisMonthProductPromise,
            thisMonthUserPromise,
            thisMonthOrderPromise,
            lastMonthProductPromise,
            lastMonthUserPromise,
            lastMonthOrderPromise,
            // Get total counts using Mongoose countDocuments()
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"), // Get all orders with just the total field
            lastsixMonthOrdersPromise,
            User.countDocuments({gender: "female"}),
            latestTransactionPromise
        ]);

        // Calculate revenue for this month and last month for comparison
        const thisMonthRevenue = thisMonthOrder.reduce((total, order) =>  
            total + (order.total || 0), 0
        );

        // NOTE: This should use lastMonthOrder instead of thisMonthOrder - likely a bug
        const lastMonthRevnue = thisMonthOrder.reduce((total, order) =>  
            total + (order.total || 0), 0
        );

        // Calculate total revenue from all orders
        const revenueCount = allOrdersCount.reduce((total, order) =>  
            total + (order.total || 0), 0
        );

        // Organize count data
        const count = {
            user: userCount,
            product: productcount,
            order: allOrdersCount.length,
            revenu: revenueCount
        }

        // Calculate percentage changes between this month and last month
        const changePercent = {
            revenue: calculatePercentage(
                thisMonthRevenue,
                lastMonthRevnue
            ),
            product: calculatePercentage(
                thismonthProduct.length,
                lastMonthProduct.length
            ),
            user: calculatePercentage(
                thisMonthUser.length,
                lastMonthUser.length
            ),
            order: calculatePercentage(
                thisMonthOrder.length,
                lastMonthOrder.length
            )
        }

        // Create arrays to store monthly data for the last 6 months
        // Each position represents a month (0 = 6 months ago, 5 = current month)
        const orderMonthCount = new Array(6).fill(0);  // Array to track order count by month
        const orderMonthlyRevenue = new Array(6).fill(0);  // Array to track revenue by month

        // Loop through each order from the last 6 months
        lastsixMonth.forEach((order) => {
            const creationDate = order.createdAt;
            
            // Calculate difference between current month and order creation month
            const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
            
            // Only process if the order is from the last 6 months
            if(monthDiff < 6) {
                // Calculate the index in our arrays
                // 6 - monthDiff - 1 transforms the month difference to array index:
                // If monthDiff = 0 (current month), index = 5 (last position)
                // If monthDiff = 5 (5 months ago), index = 0 (first position)
                orderMonthCount[6 - monthDiff - 1] += 1;  // Increment order count for that month
                orderMonthlyRevenue[6 - monthDiff - 1] += order.total;  // Add revenue for that month
            }
        });

        // FOR THE FEMALE COUNT 

        const userRatio = {
            male: userCount - femaleCount,
            female: femaleCount
        };

        // modifies transaction 

        const modifiedTransaction = latestTransaction.map((i) => ({
            _id: i._id,
            amount: i.total,
            discount: i.discount,
            quantity: i.orderItems.length,
            status: i.status
        }));


        // Combine all calculated data into the stats object
        stats = {
            changePercent,
            count,
            chartData: {
                order: orderMonthCount,
                revenue: orderMonthlyRevenue
            },
            userRatio,
            latestTransaction: modifiedTransaction
        }


        myCache.set("admin-stats" , JSON.stringify('stats'));
    }

    // Send the stats as a JSON response
    res.status(200).json({
        success: true,
        stats
    });
});

// These controller functions are empty placeholders for future implementation let's see
// ===========for the barchart ============================
export const barChartStats = TryCatch(async(req, res, next) => {
    // Implementation pending

});

// ============for the pie chart ===========================
export const pieChartStats = TryCatch(async(req, res, next) => {
    // Implementation pending
});

// ============for the line chart ===========================
export const lineChartStats = TryCatch(async(req, res, next) => {
    // Implementation pending
});