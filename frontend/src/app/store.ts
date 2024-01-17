import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import usersApi from '../features/users/usersApi';
import cookiesReducer from '../features/users/cookiesSlice';
import alertReducer from '../features/alert/alertSlice';

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    cookies: cookiesReducer,
    alert: alertReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(usersApi.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
