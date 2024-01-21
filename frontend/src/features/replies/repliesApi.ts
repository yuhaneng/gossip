import Cookies from "js-cookie";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface GetRepliesByCommentData {
    page: number,
    commentId: string
}

export interface GetRepliesByUserData {
    page: number,
    user: string
}

export interface CreateReplyData {
    commentId: string,
    content: string
}

export interface EditReplyData extends CreateReplyData {
    id: string
}

export interface VoteReplyData {
    id: string,
    vote: "up" | "down" | "none"
}

export interface ReplyData extends  Omit<EditReplyData, 'commentId'> {
    comment_id: string,
    post_id: string,
    author: string,
    upvotes: number,
    downvotes: number,
    user_vote: "up" | "down" | "none",
    created_at: string,
    updated_at: string
}

const API_URL = "http://localhost:3000/replies"

const repliesApi = createApi({
    reducerPath: 'replies',
    baseQuery: fetchBaseQuery( {
        baseUrl: API_URL,
        prepareHeaders: (headers) => {
            const token = Cookies.get("accessToken");
            if (token) {
                headers.set("Authorization", "Bearer " + token)
            }
            return headers
        }
     }),
    tagTypes: ["Reply"],
    endpoints: (builder) => ({
        getRepliesByComment: builder.query<ReplyData[], GetRepliesByCommentData>({
            query: (getData) => `?comment_id=${getData.commentId}&page=${getData.page}`,
            providesTags: (result = [], error, arg) => ["Reply",
                ...result.map((reply) => ({type: "Reply" as const, id: reply.id}))
            ]
        }),
        getRepliesByUser: builder.query<ReplyData[], GetRepliesByUserData>({
            query: (getData) => `?user=${getData.user}&page=${getData.page}`,
            providesTags: (result = []) => ["Reply",
                ...result.map((reply) => ({type: "Reply" as const, id: reply.id}))
            ]
        }),
        getReply: builder.query<ReplyData, string>({
            query: (id) => `/${id}`,
            providesTags: (result, error, arg) => [{type: "Reply", id: arg}]
        }),
        createReply: builder.mutation<void, CreateReplyData>({
            query: (createData) => ({
                url: '/',
                method: 'POST',
                body: {
                    reply: {
                        comment_id: createData.commentId,
                        content: createData.content,
                    }
                }
            }),
            invalidatesTags: ["Reply"]
        }),
        editReply: builder.mutation<void, EditReplyData>({
            query: (editData) => ({
                url: `/${editData.id}`,
                method: 'PUT',
                body: {
                    reply: {
                        content: editData.content
                    }
                }
            }),
            invalidatesTags: (result, error, arg) => [{type: "Reply", id: arg.id}]
        }),
        deleteReply: builder.mutation<void, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [{type: "Reply", id: arg}]
        }),
        voteReply: builder.mutation<void, VoteReplyData>({
            query: (voteData) => ({
                url: `/${voteData.id}/vote`,
                method: "POST",
                body: {
                    vote: {
                        vote: voteData.vote
                    }
                }
            }),
            invalidatesTags: (result, error, arg) => [{type: "Reply", id: arg.id}]
        })
    })
})

export default repliesApi;

export const resetReplies = repliesApi.util.resetApiState;

export const {
    useGetRepliesByCommentQuery,
    useGetRepliesByUserQuery,
    useGetReplyQuery,
    useCreateReplyMutation,
    useEditReplyMutation,
    useDeleteReplyMutation,
    useVoteReplyMutation
} = repliesApi