import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import usersApi from '../features/users/usersApi';
import cookiesReducer from '../features/users/cookiesSlice';
import alertReducer from '../features/alert/alertSlice';
import postsApi from '../features/posts/postsApi';

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    cookies: cookiesReducer,
    alert: alertReducer,
    [postsApi.reducerPath]: postsApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(usersApi.middleware)
    .concat(postsApi.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
