import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserReducerInitialState } from "../../types/reducer-types";
import { User } from "../../types/types";


const initialState: UserReducerInitialState = {
    user: null,
    loading: true,
};

// make a reducer 
export const userReducer = createSlice({
    name: 'userReducer',
    initialState,
    reducers: {
        /// make the reducer for the state
        // user exist 
        userExist: (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
        },
        // not exit user
        userNotExist: (state) => {
            state.loading = false;
            state.user = null;
        }
    }
});

export const { userExist, userNotExist } = userReducer.actions;
export default userReducer.reducer;