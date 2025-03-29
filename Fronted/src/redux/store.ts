// set the configuratiuon of the store 


import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userApi";
import userReducer from './reducer/userReducer';
import { productAPI } from "./api/productAPI";
import { cartReducer } from "./reducer/cartReducer";
import { orderApi } from "./api/orderApi";
import { dashboardApi } from "./api/dashbordApi";  

export const server = import.meta.env.BACKEND_SERVER_URL;

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        user: userReducer,
        cart: cartReducer.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
            .concat(userApi.middleware)
            .concat(productAPI.middleware)
            .concat(orderApi.middleware)
            .concat(dashboardApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;