import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllOrdersResponse, MessageResponse, NewOrderRequest, UpdateOrderRequest } from "../../types/api-types";



export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.BACKEND_SERVER_URL}/api/v1/order/`,
      }),
      tagTypes: ["order"],
      endpoints: (builder) => ({
        newOrder: builder.mutation<MessageResponse , NewOrderRequest>({
              query: (order) => ({
                url: 'new',
                method: "POST",
                body: order, 
              }),
              invalidatesTags: ['order']
            }),
            // update the order

        updateOrder: builder.mutation<MessageResponse , UpdateOrderRequest>({
                query: ({orderId , userId}) => ({
                  url: `${orderId}?id=${userId}`,
                  method: "PUT"
                }),
                invalidatesTags: ['order']
        }),
        deleteOrder: builder.mutation<MessageResponse , UpdateOrderRequest >({
            query: ({orderId , userId}) => ({
              url: `${orderId}?id=${userId}`,
              method: "PUT"
            }),
            invalidatesTags: ['order']
    }),

        myOrder: builder.query<AllOrdersResponse, string>({
              query: (id) => `my?/id=${id}`,
              providesTags: ['order']
            }),
            
        allOrder: builder.query<AllOrdersResponse, string>({
                query: (id) => `all?/id=${id}`,
                providesTags: ['order']
            }),
            
        orderDetails: builder.query<AllOrdersResponse, string>({
                query: (id) => `id=${id}`,
                providesTags: ['order']
        }), 
        }),
        
});


export const {
    useNewOrderMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
    useMyOrderQuery,
    useAllOrderQuery,
    useOrderDetailsQuery
} = orderApi;