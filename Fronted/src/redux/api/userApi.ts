

import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//import { server } from "../store";
import { MessageResponse } from "../../types/api-types";
import { User } from "../../types/types";


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
            })
        })
    })
})


export const {useLoginMutation} = userApi