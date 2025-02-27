// All the routes of the admin bord 

import express from "express";
import { adminOnly } from "../middleware/auth.js";
import { barChartStats, dashbordStats, lineChartStats, pieChartStats } from "../Controllers/dashboard.js";


const app = express.Router();


// get the data in the diff forms \


app.get("/stats" , adminOnly , dashbordStats);

app.get("/bar" , adminOnly , barChartStats);


app.get("/pie" , adminOnly , pieChartStats);

app.get("/line" , adminOnly , lineChartStats);






export default app;