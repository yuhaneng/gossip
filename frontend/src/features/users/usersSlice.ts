import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { RootState } from "../../app/store";

interface CookiesState {
    username: string,
    admin: boolean,
    isSignedIn: boolean,
    canRefresh: boolean
}

type UpdateUserData = {
    type: "signOut"
} | {
    type: "signInForget",
    username: string,
    admin: boolean,
    accessToken: string,
    accessExpiry: string
} | {
    type: "signInRemember",
    username: string,
    admin: boolean,
    accessToken: string,
    accessExpiry: string
    refreshToken: string,
    refreshExpiry: string
}

const initialState: CookiesState = {
    username: "",
    admin: false,
    isSignedIn: false,
    canRefresh: false
}

export const usersSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        checkCookies: (state: CookiesState) => {
            const accessToken = Cookies.get("accessToken");
            const accessExpiry = Cookies.get("accessExpiry");
            const refreshToken = Cookies.get("refreshToken");
            const refreshExpiry = Cookies.get("refreshExpiry");
            return {
                username: state.username,
                admin: state.admin,
                isSignedIn: !!accessToken && !!accessExpiry && Number(accessExpiry) > Math.round(Date.now() / 1000),
                canRefresh: !!refreshToken && !!refreshExpiry && Number(refreshExpiry) > Math.round(Date.now() / 1000)
            }
        },
        updateUser: (state: CookiesState, action: PayloadAction<UpdateUserData>) => {
            if (action.payload.type === "signOut") {
                Cookies.remove("accessToken");
                Cookies.remove("accessExpiry");
                Cookies.remove("refreshToken");
                Cookies.remove("refreshExpiry");
                return {
                    username: "",
                    admin: false,
                    isSignedIn: false,
                    canRefresh: false
                }
            } else if (action.payload.type === "signInForget") {;
                Cookies.set("accessToken", action.payload.accessToken);
                Cookies.set("accessExpiry", action.payload.accessExpiry);
                Cookies.remove("refreshToken");
                Cookies.remove("refreshExpiry");
                return {
                    username: action.payload.username,
                    admin: action.payload.admin,
                    isSignedIn: true,
                    canRefresh: false
                }
            } else {
                Cookies.set("accessToken", action.payload.accessToken);
                Cookies.set("accessExpiry", action.payload.accessExpiry);
                Cookies.set("refreshToken", action.payload.refreshToken);
                Cookies.set("refreshExpiry", action.payload.refreshExpiry);
                return {
                    username: action.payload.username,
                    admin: action.payload.admin,
                    isSignedIn: true,
                    canRefresh: true
                }
            }
        }
    }
});

export const selectIsSignedIn = (state: RootState) => state.profile.isSignedIn;
export const selectCanRefresh = (state: RootState) => state.profile.canRefresh;
export const selectUsername = (state: RootState) => state.profile.username;
export const selectAdmin = (state: RootState) => state.profile.admin;

export const { checkCookies, updateUser } = usersSlice.actions;

export default usersSlice.reducer;