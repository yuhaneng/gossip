import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { checkCookies, selectCanRefresh, selectIsSignedIn, setCookies } from '../features/users/cookiesSlice';
import { useGetProfileQuery, useRefreshSessionMutation } from '../features/users/usersApi';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createAlert, createAlertData } from '../features/alert/alertSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Refreshes token if access token expired and refresh token valid.
export function useAutoSignIn() {
    const dispatch = useAppDispatch();
    const isSignedIn = useAppSelector(selectIsSignedIn);
    const canRefresh = useAppSelector(selectCanRefresh);
    const [refresh] = useRefreshSessionMutation();

    dispatch(checkCookies());
    useEffect(() => {
        if (!isSignedIn && canRefresh) {
            refresh().unwrap()
                .then((value) => dispatch(setCookies({
                    type: "signInRemember", 
                    userId: value.user_id,
                    accessToken: value.access_token,
                    accessExpiry: value.access_expiry,
                    refreshToken: value.refresh_token,
                    refreshExpiry: value.refresh_expiry
                })))
        }
    }, [isSignedIn, canRefresh])
}

// Refreshes token if access token expired and refresh token valid, 
// then redirects to sign in page if still not signed in
export function useCheckSignedIn() {
    const dispatch = useAppDispatch();
    const isSignedIn = useAppSelector(selectIsSignedIn);
    const canRefresh = useAppSelector(selectCanRefresh);
    const [refresh] = useRefreshSessionMutation();
    const navigate = useNavigate();

    dispatch(checkCookies());
    useEffect(() => {
        if (!isSignedIn) {
            if (canRefresh) {
                refresh().unwrap()
                    .then((value) => dispatch(setCookies({
                        type: "signInRemember", 
                        userId: value.user_id,
                        accessToken: value.access_token,
                        accessExpiry: value.access_expiry,
                        refreshToken: value.refresh_token,
                        refreshExpiry: value.refresh_expiry
                    })))
                    .catch(() => navigate('user/signin'))
            } else {
                const alertData : createAlertData = {
                    severity : "error",
                    alert : "Not signed in."
                }
                dispatch(createAlert(alertData));
                navigate('users/signin')
            }
        }
    }, [isSignedIn, canRefresh])
}

// Returns whether checkname and username match.
export function useCheckCorrectUserRelax(checkname: string) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [match, setMatch] = useState(true);
    const {data: profile} = useGetProfileQuery();

    useEffect(() => {
        const username = profile?.username;
        if (username && checkname !== "" && username !== checkname) {
            setMatch(false)
        } else {
            setMatch(true)
        }
    }, [checkname])

    return match
}

// Redirects to posts page if checkname and username do not match.
export function useCheckCorrectUserStrict(checkname: string) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {data: profile} = useGetProfileQuery();

    useEffect(() => {
        const username = profile?.username;
        if (username && checkname !== "" && username !== checkname) {
            const alertData : createAlertData = {
                severity : "error",
                alert : "Not authorized to access this page."
            }
            dispatch(createAlert(alertData));
            navigate("/posts")
        }
    }, [checkname])
}