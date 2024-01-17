import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { RootState } from "../../app/store";

export interface CookiesState {
    isSignedIn: boolean,
    canRefresh: boolean
}

export type SetCookiesData = {
    type: "signOut"
} | {
    type: "signInForget",
    userId: string,
    accessToken: string,
    accessExpiry: string
} | {
    type: "signInRemember",
    userId: string,
    accessToken: string,
    accessExpiry: string
    refreshToken: string,
    refreshExpiry: string
}

const initialState: CookiesState = {
    isSignedIn: false,
    canRefresh: false
}

export const cookiesSlice = createSlice({
    name: 'cookies',
    initialState,
    reducers: {
        checkCookies: (state: CookiesState) => {
            const userId = Cookies.get("userId");
            const accessToken = Cookies.get("accessToken");
            const accessExpiry = Cookies.get("accessExpiry");
            const refreshToken = Cookies.get("refreshToken");
            const refreshExpiry = Cookies.get("refreshExpiry");
            return {
                isSignedIn: !!userId && !!accessToken && !!accessExpiry && Number(accessExpiry) > Math.round(Date.now() / 1000),
                canRefresh: !!refreshToken && !!refreshExpiry && Number(refreshExpiry) > Math.round(Date.now() / 1000)
            }
        },
        setCookies: (state: CookiesState, action: PayloadAction<SetCookiesData>) => {
            if (action.payload.type === "signOut") {
                Cookies.remove("userId");
                Cookies.remove("accessToken");
                Cookies.remove("accessExpiry");
                Cookies.remove("refreshToken");
                Cookies.remove("refreshExpiry");
                return {
                    isSignedIn: false,
                    canRefresh: false
                }
            } else if (action.payload.type === "signInForget") {
                Cookies.set("userId", action.payload.userId);
                Cookies.set("accessToken", action.payload.accessToken);
                Cookies.set("accessExpiry", action.payload.accessExpiry);
                Cookies.remove("refreshToken");
                Cookies.remove("refreshExpiry");
                return {
                    isSignedIn: true,
                    canRefresh: false
                }
            } else {
                Cookies.set("userId", action.payload.userId);
                Cookies.set("accessToken", action.payload.accessToken);
                Cookies.set("accessExpiry", action.payload.accessExpiry);
                Cookies.set("refreshToken", action.payload.refreshToken);
                Cookies.set("refreshExpiry", action.payload.refreshExpiry);
                return {
                    isSignedIn: true,
                    canRefresh: true
                }
            }
        }
    }
});

export const selectIsSignedIn = (state: RootState) => state.cookies.isSignedIn;
export const selectCanRefresh = (state: RootState) => state.cookies.canRefresh;

export const { checkCookies, setCookies } = cookiesSlice.actions;

export default cookiesSlice.reducer;