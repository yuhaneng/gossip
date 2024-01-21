import Cookies from "js-cookie";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface GetCommentsByPostData {
    page: number,
    sortBy: "time" | "rating",
    postId: string
}

export interface GetCommentsByUserData {
    page: number,
    sortBy: "time" | "rating",
    user: string
}

export interface CreateCommentData {
    postId: string,
    content: string
}

export interface EditCommentData extends CreateCommentData {
    id: string
}

export interface VoteCommentData {
    id: string,
    vote: "up" | "down" | "none"
}

export interface CommentData extends Omit<EditCommentData, 'postId'> {
    post_id: string,
    author: string,
    upvotes: number,
    downvotes: number,
    user_vote: "up" | "down" | "none",
    created_at: string,
    updated_at: string
}

const API_URL = "http://localhost:3000/comments"

const commentsApi = createApi({
    reducerPath: 'comments',
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
    tagTypes: ["Comment"],
    endpoints: (builder) => ({
        getCommentsByPost: builder.query<CommentData[], GetCommentsByPostData>({
            query: (getData) => `?post_id=${getData.postId}&page=${getData.page}&sort=${getData.sortBy}`,
            providesTags: (result = [], error, arg) => ["Comment",
                ...result.map((comment) => ({type: "Comment" as const, id: comment.id}))
            ]
        }), 
        getCommentsByUser: builder.query<CommentData[], GetCommentsByUserData>({
            query: (getData) => `?user=${getData.user}&page=${getData.page}&sort=${getData.sortBy}`,
            providesTags: (result = []) => ["Comment",
                ...result.map((comment) => ({type: "Comment" as const, id: comment.id}))
            ]
        }),
        getComment: builder.query<CommentData, string>({
            query: (id) => `/${id}`,
            providesTags: (result, error, arg) => [{type: "Comment", id: arg}]
        }),
        createComment: builder.mutation<void, CreateCommentData>({
            query: (createData) => ({
                url: '/',
                method: 'POST',
                body: {
                    comment: {
                        post_id: createData.postId,
                        content: createData.content,
                    }
                }
            }),
            invalidatesTags: ["Comment"]
        }),
        editComment: builder.mutation<void, EditCommentData>({
            query: (editData) => ({
                url: `/${editData.id}`,
                method: 'PUT',
                body: {
                    comment: {
                        content: editData.content
                    }
                }
            }),
            invalidatesTags: (result, error, arg) => [{type: "Comment", id: arg.id}]
        }),
        deleteComment: builder.mutation<void, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [{type: "Comment", id: arg}]
        }),
        voteComment: builder.mutation<void, VoteCommentData>({
            query: (voteData) => ({
                url: `/${voteData.id}/vote`,
                method: "POST",
                body: {
                    vote: {
                        vote: voteData.vote
                    }
                }
            }),
            invalidatesTags: (result, error, arg) => [{type: "Comment", id: arg.id}]
        })
    })
})

export default commentsApi;

export const resetComments = commentsApi.util.resetApiState;

export const {
    useGetCommentsByPostQuery,
    useGetCommentsByUserQuery,
    useGetCommentQuery,
    useCreateCommentMutation,
    useEditCommentMutation,
    useDeleteCommentMutation,
    useVoteCommentMutation
} = commentsApi