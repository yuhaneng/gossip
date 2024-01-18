import { createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit"; 
import { RootState } from "../../app/store"; 
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface alertState {
    active: boolean,
    severity: "success" | "info" | "warning" | "error",
    alert: string
}

type createAlertData = Omit<alertState, 'active'>;

const initialState: alertState = {
    active: false,
    severity: "success",
    alert: ""
}

export const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        createAlert: (state: alertState, action: PayloadAction<createAlertData>) => {
            return {...action.payload, active: true}
        },
        destroyAlert: () => {
            return initialState
        }
    }
})

export function getErrorMessage(error: FetchBaseQueryError | SerializedError) {
    let errorMessage: string;
    if ('status' in error) {
        if ('error' in error) {
            errorMessage = error.error;
        } else {
            errorMessage = (error.data as { error: string }).error;
            // errorMessage = JSON.stringify(error.data)
        }
    } else {
        if ('message' in error) {
            errorMessage = error.message!;
        } else {
            errorMessage = "Unknown Error";
        }
    }
    return errorMessage;
}  


export const selectAlert = (state: RootState) => state.alert

export const {createAlert, destroyAlert} = alertSlice.actions;

export default alertSlice.reducer;