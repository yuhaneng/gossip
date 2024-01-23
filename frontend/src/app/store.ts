import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import usersApi from '../features/users/usersApi';
import usersReducer from '../features/profile/usersSlice';
import alertReducer from '../features/alert/alertSlice';
import postsApi from '../features/posts/postsApi';
import commentsApi from '../features/comments/commentsApi';
import repliesApi from '../features/replies/repliesApi';

export const API_URL = "http://localhost:3000/";

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    profile: usersReducer,
    alert: alertReducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [repliesApi.reducerPath]: repliesApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(usersApi.middleware)
    .concat(postsApi.middleware)
    .concat(commentsApi.middleware)
    .concat(repliesApi.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
