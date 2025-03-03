// set the configuratiuon of the store 


import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userApi";
import {useReducer} from './reducer/userReducer'

export const server = import.meta.env.BACKEND_SERVER_URL
export const store = configureStore({
    reducer: {
        userApi: userApi.reducer,
        useReducer: useReducer.reducer,
    },
    middleware: (mid) => [...mid() , userApi.middleware]

})