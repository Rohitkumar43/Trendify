import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllUsersResponse, DeleteUserRequest, MessageResponse, UserResponse } from "../../types/api-types";
import { User } from "../../types/types";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_SERVER_URL || 'http://localhost:4000';

export const userApi = createApi({
    reducerPath: 'userapi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BACKEND_URL}/api/v1/user/`
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        login: builder.mutation<MessageResponse, User>({
            query: (user) => ({
                url: 'new',
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['User'],
        }),

        getAllUsers: builder.query<AllUsersResponse, string>({
            query: (adminId) => ({
                url: `all?id=${adminId}`,
                method: 'GET'
            }),
            providesTags: ['User'],
        }),

        deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
            query: ({ userId, adminUserId }) => ({
                url: `${userId}?id=${adminUserId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const getUser = async (id: string) => {
    try {
        const { data }: { data: UserResponse } = await axios.get(
            `${BACKEND_URL}/api/v1/user/${id}?id=${id}`
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const { useLoginMutation, useGetAllUsersQuery, useDeleteUserMutation } = userApi;