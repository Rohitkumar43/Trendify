import { CartItem, ShippingInfo, User } from "./types";

export interface UserReducerInitialState {
  user: User | null;
  loading: boolean;
}


// for the cartreducer query 
export interface CartReducerInitialState {
  loading: boolean;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  shippingCharge: number;
  discount: number;
  total: number;
  coupan: string;
  shippingInfo: ShippingInfo;
}



