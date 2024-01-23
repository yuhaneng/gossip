import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { RootState } from "../../app/store";

interface CookiesState {
    id: string,
    username: string,
    admin: boolean,
    isSignedIn: boolean,
    canRefresh: boolean
}

type UpdateUserData = {
    type: "signOut"
} | {
    type: "signInForget",
    id: string,
    username: string,
    admin: boolean,
    accessToken: string,
    accessExpiry: string
} | {
    type: "signInRemember",
    id: string,
    username: string,
    admin: boolean,
    accessToken: string,
    accessExpiry: string
    refreshToken: string,
    refreshExpiry: string
}

const initialState: CookiesState = {
    id: "",
    username: "",
    admin: false,
    isSignedIn: false,
    canRefresh: false
}

export const usersSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        checkCookies: () => {
            const id = Cookies.get("id");
            const username = Cookies.get("username");
            const admin = Cookies.get("admin");
            const accessToken = Cookies.get("accessToken");
            const accessExpiry = Cookies.get("accessExpiry");
            const refreshToken = Cookies.get("refreshToken");
            const refreshExpiry = Cookies.get("refreshExpiry");
            return {
                id: id ? id : "",
                username: username ? username : "",
                admin: admin ? admin === "true" : false,
                isSignedIn: !!accessToken && !!accessExpiry && Number(accessExpiry) > Math.round(Date.now() / 1000),
                canRefresh: !!refreshToken && !!refreshExpiry && Number(refreshExpiry) > Math.round(Date.now() / 1000)
            }
        },
        updateUser: (state: CookiesState, action: PayloadAction<UpdateUserData>) => {
            if (action.payload.type === "signOut") {
                Cookies.remove("id");
                Cookies.remove("username");
                Cookies.remove("admin");
                Cookies.remove("accessToken");
                Cookies.remove("accessExpiry");
                Cookies.remove("refreshToken");
                Cookies.remove("refreshExpiry");
                return {
                    id: "",
                    username: "",
                    admin: false,
                    isSignedIn: false,
                    canRefresh: false
                }
            } else if (action.payload.type === "signInForget") {;
                Cookies.set("id", action.payload.id);
                Cookies.set("username", action.payload.username);
                Cookies.set("admin", action.payload.admin ? "true" : "false");
                Cookies.set("accessToken", action.payload.accessToken);
                Cookies.set("accessExpiry", action.payload.accessExpiry);
                Cookies.remove("refreshToken");
                Cookies.remove("refreshExpiry");
                return {
                    id: action.payload.id,
                    username: action.payload.username,
                    admin: action.payload.admin,
                    isSignedIn: true,
                    canRefresh: false
                }
            } else {
                Cookies.set("id", action.payload.id);
                Cookies.set("username", action.payload.username);
                Cookies.set("admin", action.payload.admin ? "true" : "false");
                Cookies.set("accessToken", action.payload.accessToken);
                Cookies.set("accessExpiry", action.payload.accessExpiry);
                Cookies.set("refreshToken", action.payload.refreshToken);
                Cookies.set("refreshExpiry", action.payload.refreshExpiry);
                return {
                    id: action.payload.id,
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
export const selectId = (state: RootState) => state.profile.id;
export const selectUsername = (state: RootState) => state.profile.username;
export const selectAdmin = (state: RootState) => state.profile.admin;

export const { checkCookies, updateUser } = usersSlice.actions;

export default usersSlice.reducer;