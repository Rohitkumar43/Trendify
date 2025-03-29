// HERE WE WILL WRITE THE TYPES OF THE API 

import {
  Bar,
  CartItem,
  CouponType,
  Line,
  Order,
  Pie,
  Review,
  ShippingInfo,
  Stats,
  User,
} from "./types";

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  photos: { url: string }[];
  description: string;
}

export interface CustomError {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
}

export interface AllUsersResponse {
  success: boolean;
  users: User[];
}

export interface UserResponse {
  success: boolean;
  user: User;
}

export interface AllProductsResponse {
  success: boolean;
  products: Product[];
}

export interface CategoriesResponse {
  success: boolean;
  categories: string[];
}

export interface SearchProductsRequest {
  price?: number;
  page?: number;
  category?: string;
  search?: string;
  sort?: string;
}

export interface SearchProductsResponse {
  success: boolean;
  products: Product[];
  totalPages: number;
}

export interface NewProductRequest {
  id: string;
  formData: FormData;
}

export interface UpdateProductRequest {
  userId: string;
  productId: string;
  formData: FormData;
}

export interface DeleteProductRequest {
  userId: string;
  productId: string;
}

export interface ProductResponse {
  success: boolean;
  product: Product;
}

export interface AllReviewsResponse {
  success: boolean;
  reviews: Review[];
}

export interface AllOrdersResponse {
  success: boolean;
  orders: Order[];
}

export interface OrderDetailsResponse {
  success: boolean;
  order: Order;
}

export interface StatsResponse {
  success: boolean;
  stats: Stats;
}

export interface PieResponse {
  success: boolean;
  charts: Pie;
}

export interface BarResponse {
  success: boolean;
  charts: Bar;
}

export interface LineResponse {
  success: boolean;
  charts: Line;
}

export interface NewReviewRequest {
  rating: number;
  comment: string;
  productId: string;
  userId: string;
}

export interface DeleteReviewRequest {
  userId: string;
  reviewId: string;
}

export interface NewOrderRequest {
  shippingInfo: ShippingInfo;
  orderItems: CartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  user: string;
}

export interface UpdateOrderRequest {
  userId: string;
  orderId: string;
}

export interface DeleteUserRequest {
  userId: string;
  adminUserId: string;
}

export interface AllDiscountResponse {
  success: boolean;
  coupons: CouponType[];
}

export interface SingleDiscountResponse {
  success: boolean;
  coupon: CouponType;
}