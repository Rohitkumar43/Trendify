import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserReducerInitialState } from "../../types/reducer-types";


const initialState: UserReducerInitialState = {
    user: null,
    loading: true,
};

// make a reducer 

export const cartReducer = createSlice({
    name: 'useReducer',
    initialState,
    reducers: {
        
    }
});


