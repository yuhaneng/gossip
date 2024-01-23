import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { checkCookies, selectAdmin, selectCanRefresh, selectId, selectIsSignedIn, updateUser } from '../features/profile/usersSlice';
import { useRefreshSessionMutation } from '../features/users/usersApi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createAlert, getErrorMessage } from '../features/alert/alertSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

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
                .then((value) => dispatch(updateUser({
                    type: "signInRemember", 
                    id: value.id,
                    username: value.username,
                    admin: value.admin,
                    accessToken: value.access_token,
                    accessExpiry: value.access_expiry,
                    refreshToken: value.refresh_token,
                    refreshExpiry: value.refresh_expiry
                })))
                .catch(() => {})
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
                    .then((value) => dispatch(updateUser({
                        type: "signInRemember", 
                        id: value.id,
                        username: value.username,
                        admin: value.admin,
                        accessToken: value.access_token,
                        accessExpiry: value.access_expiry,
                        refreshToken: value.refresh_token,
                        refreshExpiry: value.refresh_expiry
                    })))
                    .catch(() => {
                        dispatch(createAlert({
                            severity : "error",
                            alert : "Not signed in."
                        }));
                        navigate('/users/signin');
                    })
            } else {
                dispatch(createAlert({
                    severity : "error",
                    alert : "Not signed in."
                }));
                navigate('/users/signin')
            }
        }
    }, [isSignedIn, canRefresh])
}

// Returns whether checkid and user's id match.
export function useCheckCorrectUserRelax(checkid: string) {
    const [match, setMatch] = useState(true);
    const id = useAppSelector(selectId);
    const admin = useAppSelector(selectAdmin);

    useEffect(() => {
        if (checkid !== "" && id !== checkid && !admin) {
            setMatch(false)
        } else {
            setMatch(true)
        }
    }, [checkid])

    return match
}

// Redirects to posts page if checkid and user's id do not match.
export function useCheckCorrectUserStrict(checkid: string) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const id = useAppSelector(selectId);
    const admin = useAppSelector(selectAdmin);

    useEffect(() => {
        if (checkid !== "" && id !== checkid && !admin) {
            dispatch(createAlert({
                severity : "error",
                alert : "Not authorized to access this page."
            }));
            navigate("/posts")
        }
    }, [checkid])
}

// Returns whether the user is at the bottom of the page.
export function useScroll() {
    const [atBottom, setAtBottom] = useState(false)
    useEffect(() => {
        const handleScroll = () => {
            const offsetHeight = document.documentElement.offsetHeight;
            const innerHeight = window.innerHeight;
            const scrollTop = document.documentElement.scrollTop;
        
            const hasReachedBottom = offsetHeight - (innerHeight + scrollTop) <= 10;
        
            if (hasReachedBottom) {
                setAtBottom(true);
            } else {
                setAtBottom(false);
            }
        };
      
        window.addEventListener("scroll", handleScroll);
      
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return atBottom;
}

// Creates error alert when new error detected.
export function useErrorAlert(error: FetchBaseQueryError | SerializedError | undefined) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (error) {
            dispatch(createAlert({
                severity: "error",
                alert: getErrorMessage(error)
            }));
        }
    }, [error])
}

// Creates success alert, navigates to link and performs optional action when successful.
export function useOnSuccess(isSuccess: boolean, message: string, link?: string | number, action?: () => void) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            dispatch(createAlert({
                severity : "success",
                alert: message
            }));
            if (typeof link === 'string') {
                navigate(link);
            } else if (typeof link === 'number'){
                navigate(link);
            }
            if (action) {
                action();
            }
        }
    }, [isSuccess])
}

// Create form data and form error state handlers, 
// automatically fill in autoFillData when it is received.
export function useFormHandler<FormData>
    (initialData: FormData, autoFillData?: {[field in keyof FormData]?: any} | undefined){
        const [formData, setFormData] = useState(initialData);
        
        type FormError = {[field in keyof FormData]: boolean};
        const initialError: FormError = 
            Object.keys(initialData as {[field in keyof FormData]: string}).reduce(
                (o: FormError, key: string) => Object.assign(o, {[key]: false}), 
                {} as FormError
            );
        const [formError, setFormError] = useState(initialError);

        function handleInput(inputs: {[field in keyof FormData]?: any}) {
            setFormData({...formData, ...inputs});
            const errorsReset: FormError = 
                Object.keys(inputs).reduce(
                    (o: FormError, key: any) => Object.assign(o, {[key]: false}), 
                    {} as FormError
                );
            setFormError(errorsReset)
        }

        function handleError(errors: {[field in keyof FormData]?: boolean}) {
            setFormError({...formError, ...errors});
        }
        
        useEffect(() => {
            if (autoFillData) {
                handleInput(autoFillData)
            }
        }, [autoFillData])

        return {formData, formError, handleInput, handleError}
}
