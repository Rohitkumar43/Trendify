/**
 * Cart Reducer for E-Commerce Application
 * 
 * This Redux slice handles the shopping cart functionality including:
 * - Adding/removing items to cart
 * - Calculating prices (subtotal, tax, shipping)
 * - Managing shipping information
 * - Applying discounts
 * - Resetting cart state
 * 
 * The reducer works with TypeScript types to ensure type safety throughout the application.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItem, ShippingInfo } from "../../types/types";

// Initial state with default values
const initialState: CartReducerInitialState = {
  loading: false,           
  cartItems: [],         
  subtotal: 0,              
  tax: 0,                  
  shippingCharge: 0,        
  discount: 0,           
  total: 0,               
  shippingInfo: {      
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
};

export const cartReducer = createSlice({
    name: 'cartReducer',    // Fixed the name from 'useReducer' to 'cartReducer' for clarity
    initialState,
    reducers: {
        /**
         * Adds an item to the cart or updates it if already exists
         * @param action.payload - The cart item to add/update
         */
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.loading = true;
      
            // Check if the item already exists in cart
            const index = state.cartItems.findIndex(
              (i) => i.productId === action.payload.productId
            );
      
            // Update existing item or add new one
            if (index !== -1) state.cartItems[index] = action.payload;
            else state.cartItems.push(action.payload);
            
            state.loading = false;
        },
      
        /**
         * Removes an item from the cart by its productId
         * @param action.payload - The productId to remove
         */
        removeCartItem: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter(
              (i) => i.productId !== action.payload
            );
            state.loading = false;
        },
      
        /**
         * Calculates all price components based on current cart items
         * - Subtotal: Sum of (price * quantity) for all items
         * - Shipping: Free for orders over ₹1000, otherwise ₹200
         * - Tax: 18% of subtotal
         * - Total: subtotal + tax + shipping - discount
         */
        calculatePrice: (state) => {
            const subtotal = state.cartItems.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            );
      
            state.subtotal = subtotal;
            state.shippingCharge = state.subtotal > 1000 ? 0 : 200;
            state.tax = Math.round(state.subtotal * 0.18);
            state.total =
              state.subtotal + state.tax + state.shippingCharge - state.discount;
        },
      
        /**
         * Applies a discount amount to the cart
         * @param action.payload - The discount amount to apply
         */
        discountApplied: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
        },
      
       
        // /**
        //  * Saves a coupon code
        //  * @param action.payload - The coupon code
        //  */
        saveCoupon: (state, action: PayloadAction<string>) => {
          state.coupan = action.payload;
        },
        
        /**
         * Saves the customer's shipping information
         * @param action.payload - The shipping info object
         */
        saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
            state.shippingInfo = action.payload;
        },
        
        /**
         * Resets the cart to its initial empty state
         * Used after order completion or when a user logs out
         */
        resetCart: () => initialState,
    }
});

// Export action creators for use in components
export const { 
    addToCart, 
    removeCartItem, 
    calculatePrice, 
    discountApplied, 
    saveShippingInfo, 
    resetCart 
} = cartReducer.actions;

// Export the reducer for store configuration
export default cartReducer.reducer;