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
    id: string,
    username: string,
    email: string,
    about: string
}

export interface AuthData {
    id: string,
    username: string,
    admin: boolean,
    access_token: string,
    access_expiry: string,
    refresh_token: string,
    refresh_expiry: string
}

export interface ProfileData extends EditProfileData {
    created_at: string,
    ui_style: string,
    is_private: boolean
}

interface ChangePasswordData {
    id: string,
    oldPassword: string,
    password: string
}

interface ChangeSettingsData {
    id: string,
    uiStyle: string,
    isPrivate: boolean
}

const usersApi = createApi({
    reducerPath: 'users',
    baseQuery: fetchBaseQuery( {
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers, {endpoint}) => {
            const accessEndpoints = [
                'getProfile', 
                'getOwnProfile',
                'deleteProfile', 
                'editProfile', 
                'changePassword', 
                'changeSettings'
            ]
            if (accessEndpoints.includes(endpoint)) {
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
                    username: signUpData.username,
                    email: signUpData.email,
                    password: signUpData.password
                },
            }),
            invalidatesTags: ["Profile"]
        }),
        signIn: builder.mutation<AuthData, SignInData>({
            query: (signInData) => ({
                url: signInData.remember ? "signin?remember=yes": "signin",
                method: 'POST',
                body: {
                    username: signInData.username,
                    password: signInData.password
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
        getOwnProfile: builder.query<ProfileData, void>({
            query: () => 'profile/',
            providesTags: ["Profile"]
        }),
        getProfile: builder.query<ProfileData, string>({
            query: (id) => `profile/${id}`,
            providesTags: ["Profile"]
        }),
        deleteProfile: builder.mutation<void, string>({
            query: (id) => ({
                url: `profile/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["Profile"]
        }),
        editProfile: builder.mutation<void, EditProfileData>({
            query: (editProfileData) => ({
                url: `profile/${editProfileData.id}`,
                method: 'PUT',
                body: {
                    username: editProfileData.username,
                    email: editProfileData.email,
                    about: editProfileData.about
                }
            }),
            invalidatesTags: ["Profile"]
        }),
        changePassword: builder.mutation<void, ChangePasswordData>({
            query: (changeData) => ({
                url: `profile/${changeData.id}/password`,
                method: 'PUT',
                body: {
                    old_password: changeData.oldPassword,
                    password: changeData.password
                }
            }),
            invalidatesTags: ["Profile"]
        }),
        changeSettings: builder.mutation<void, ChangeSettingsData>({
            query: (changeData) => ({
                url: `profile/${changeData.id}`,
                method: 'PUT',
                body: {
                    ui_style: changeData.uiStyle,
                    is_private: changeData.isPrivate
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
    useGetOwnProfileQuery,
    useGetProfileQuery,
    useDeleteProfileMutation,
    useEditProfileMutation,
    useChangePasswordMutation,
    useChangeSettingsMutation
} = usersApi;