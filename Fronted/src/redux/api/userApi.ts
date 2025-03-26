

import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//import { server } from "../store";
import { AllUsersResponse, DeleteUserRequest, MessageResponse, UserResponse } from "../../types/api-types";
import { User } from "../../types/types";
import axios from "axios";


export const userApi = createApi({
    reducerPath: 'userapi',
    baseQuery: fetchBaseQuery({baseUrl: `${import.meta.env.BACKEND_SERVER_URL}/api/v1/user`}),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        login: builder.mutation<MessageResponse , User>({
            query: (user) => ({
                url: 'new',
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['User'],
        }),

        deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
          query: ({ userId, adminUserId }) => ({
            url: `${userId}?id=${adminUserId}`,
            method: "DELETE",
          }),
          invalidatesTags: ['User'],
        }),
    
        allUsers: builder.query<AllUsersResponse, string>({
          query: (id: any) => `all?id=${id}`,
          providesTags: ["User"],
        }),

    }),
})


export const getUser = async (id: string) => {
    try {
      const { data }: { data: UserResponse } = await axios.get(
        `${import.meta.env.BACKEND_SERVER_URL}/api/v1/user/${id}`
      );
  
      return data;
    } catch (error) {
      throw error;
    }
  };

export const {useLoginMutation , useAllUsersQuery , useDeleteUserMutation} = userApi