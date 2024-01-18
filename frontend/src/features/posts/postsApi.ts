import Cookies from 'js-cookie';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface GetPostsByTagsData {
    page: number,
    sortBy: "time" | "rating",
    tags: string[]
}

interface GetPostsByUserData {
    page: number,
    sortBy: "time" | "rating",
    user: string
}

interface CreatePostData {
    title: string,
    content: string,
    tags: string[]
}

interface EditPostData extends CreatePostData {
    id: string
}

interface VotePostData {
    id: string,
    vote: "up" | "down" | "none"
}

export interface PostData extends EditPostData {
    author: string,
    upvotes: number,
    downvotes: number,
    user_vote: "up" | "down" | "none",
    created_at: string,
    updated_at: string
}

const API_URL = "http://localhost:3000/posts"

const postsApi = createApi({
    reducerPath: 'posts',
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
    tagTypes: ["Post"],
    endpoints: (builder) => ({
        getPostsByTags: builder.query<PostData[], GetPostsByTagsData>({
            query: (getData) => `?tags=${JSON.stringify(getData.tags)}&page=${getData.page}&sort=${getData.sortBy}`,
            providesTags: (result = []) => ["Post", ...result.map((post) => ({type: "Post" as const, id: post.id}))]
        }),
        getPostsByUser: builder.query<PostData[], GetPostsByUserData>({
            query: (getData) => `?user=${getData.user}&page=${getData.page}&sort=${getData.sortBy}`,
            providesTags: (result = []) => ["Post", ...result.map((post) => ({type: "Post" as const, id: post.id}))]
        }),
        getPost: builder.query<PostData, string>({
            query: (id) => `/${id}`,
            providesTags: (result, error, arg) => [{type: "Post", id: arg}]
        }),
        createPost: builder.mutation<PostData, CreatePostData>({
            query: (createData) => ({
                url: '/',
                method: 'POST',
                body: {
                    post: {
                        title: createData.title,
                        content: createData.content,
                        tags: createData.tags
                    }
                }
            }),
            invalidatesTags: ["Post"]
        }),
        editPost: builder.mutation<void, EditPostData>({
            query: (editData) => ({
                url: `/${editData.id}`,
                method: 'PUT',
                body: {
                    post: {
                        title: editData.title,
                        content: editData.content,
                        tags: editData.tags
                    }
                }
            }),
            invalidatesTags: (result, error, arg) => [{type: "Post", id: arg.id}]
        }),
        deletePost: builder.mutation<void, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, arg) => [{type: "Post", id: arg}]
        }),
        votePost: builder.mutation<void, VotePostData>({
            query: (voteData) => ({
                url: `/${voteData.id}/vote`,
                method: "POST",
                body: {
                    vote: {
                        vote: voteData.vote
                    }
                }
            }),
            invalidatesTags: (result, error, arg) => [{type: "Post", id: arg.id}]
        })
    })
})

export default postsApi;

export const resetPosts = postsApi.util.resetApiState;

export const { 
    useGetPostsByTagsQuery, 
    useGetPostsByUserQuery,
    useGetPostQuery,
    useCreatePostMutation, 
    useEditPostMutation, 
    useDeletePostMutation,
    useVotePostMutation
} = postsApi;