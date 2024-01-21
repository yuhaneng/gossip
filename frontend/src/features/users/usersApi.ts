import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

interface SignUpData {
    username: string,
    email: string,
    password: string,
    remember: boolean
}

interface SignInData {
    username: string,
    password: string,
    remember: boolean
}

interface EditProfileData {
    username: string,
    email: string
}

export interface AuthData {
    username: string,
    admin: boolean,
    access_token: string,
    access_expiry: string,
    refresh_token: string,
    refresh_expiry: string
}

export interface ProfileData {
    username: string,
    email: string,
    created_at: string
}

const API_URL = "http://localhost:3000/"

const usersApi = createApi({
    reducerPath: 'users',
    baseQuery: fetchBaseQuery( {
        baseUrl: API_URL,
        prepareHeaders: (headers, {endpoint}) => {
            if (endpoint === 'getProfile' || endpoint === 'deleteProfile' || endpoint === 'editProfile') {
                const accessToken = Cookies.get("accessToken");
                if (accessToken) {
                    headers.set("Authorization", "Bearer " + accessToken)
                }
                return headers
            } else if (endpoint === "refreshSession") {
                const refreshToken = Cookies.get("refreshToken");
                if (refreshToken) {
                    headers.set("Authorization", "Bearer " + refreshToken)
                }
                return headers
            }
        }
     }),
    tagTypes: ["Profile"],
    endpoints: (builder) => ({
        signUp: builder.mutation<AuthData, SignUpData>({
            query: (signUpData) => ({
                url: signUpData.remember ? "signup?remember=yes": "signup",
                method: 'POST',
                body: {
                    user: {
                        username: signUpData.username,
                        email: signUpData.email,
                        password: signUpData.password
                    }
                },
            }),
            invalidatesTags: ["Profile"]
        }),
        signIn: builder.mutation<AuthData, SignInData>({
            query: (signInData) => ({
                url: signInData.remember ? "signin?remember=yes": "signin",
                method: 'POST',
                body: {
                    user: {
                        username: signInData.username,
                        password: signInData.password
                    }
                }
            }),
            invalidatesTags: ["Profile"]
        }),
        refreshSession: builder.mutation<AuthData, void>({
            query: () => ({
                url: 'refresh',
                method: 'POST'
            }),
            invalidatesTags: ["Profile"]
        }),
        getProfile: builder.query<ProfileData, void>({
            query: () => ({
                url: "profile"
            }),
            providesTags: ["Profile"]
        }),
        deleteProfile: builder.mutation<void, void>({
            query: () => ({
                url: 'profile',
                method: 'DELETE'
            }),
            invalidatesTags: ["Profile"]
        }),
        editProfile: builder.mutation<void, EditProfileData>({
            query: (editProfileData) => ({
                url: 'profile',
                method: 'PUT',
                body: {
                    profile: {
                        username: editProfileData.username,
                        email: editProfileData.email
                    }
                }
            }),
            invalidatesTags: ["Profile"]
        })
    })
})

export default usersApi;

export const resetUsers = usersApi.util.resetApiState;

export const { 
    useSignUpMutation,
    useSignInMutation,
    useRefreshSessionMutation,
    useGetProfileQuery,
    useDeleteProfileMutation,
    useEditProfileMutation
} = usersApi;