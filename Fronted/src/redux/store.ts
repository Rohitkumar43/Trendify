// set the configuratiuon of the store 


import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userApi";
import {useReducer} from './reducer/userReducer';
import { productAPI } from "./api/productAPI";
import { cartReducer } from "./reducer/cartReducer";
import { orderApi } from "./api/orderApi";

export const server = import.meta.env.BACKEND_SERVER_URL
export const store = configureStore({
    reducer: {
        userApi: userApi.reducer,
        useReducer: useReducer.reducer,
        productAPI: productAPI.reducer,
        orderApi: orderApi.reducer,
        cartReducer: cartReducer.reducer,
    },
    middleware: (mid) => [...mid() , userApi.middleware , productAPI.middleware , orderApi.middleware]
});


export type RootState = ReturnType<typeof store.getState>;