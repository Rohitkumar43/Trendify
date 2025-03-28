// set the configuratiuon of the store 


import { configureStore, type Middleware } from "@reduxjs/toolkit";
import { userApi } from "./api/userApi";
import userReducer from './reducer/userReducer';
import { productAPI } from "./api/productAPI";
import { cartReducer } from "./reducer/cartReducer";
import { orderApi } from "./api/orderApi";

export const server = import.meta.env.BACKEND_SERVER_URL
export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        userReducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        cartReducer: cartReducer.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat([
            userApi.middleware,
            productAPI.middleware,
            orderApi.middleware
        ] as Middleware[])
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;