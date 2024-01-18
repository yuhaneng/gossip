import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { store } from './app/store';
import App from './App';
import ErrorPage from './ErrorPage';
import SignUp from './features/users/SignUp';
import SignIn from './features/users/SignIn';
import Profile from './features/users/Profile';
import EditProfile from './features/users/EditProfile';
import SignOut from './features/users/SignOut';
import CreatePost from './features/posts/CreatePost';
import EditPost from './features/posts/EditPost';
import Post from './features/posts/Post';
import Posts from './features/posts/Posts';
import CreateComment from './features/comments/CreateComment';
import EditComment from './features/comments/EditComment';
import reportWebVitals from './reportWebVitals';
import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'users',
        element: <Outlet />,
        children: [
          {
            path: 'signup',
            element: <SignUp />
          },
          {
            path: 'signin',
            element: <SignIn />
          },
          {
            path: 'profile',
            element: <Profile />
          },
          {
            path: 'profile/edit',
            element: <EditProfile />
          },
          {
            path: 'signout',
            element: <SignOut />
          }
        ]
      },
      { 
        path: 'posts',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <Posts />
          },
          {
            path: ':id',
            element: <Post />
          },
          {
            path: 'create',
            element: <CreatePost />
          },
          {
            path: ':id/edit',
            element: <EditPost />
          }
        ]
      },
      {
        path: 'comments',
        element: <Outlet />,
        children: [
          {
            path: 'create/:postId',
            element: <CreateComment />
          },
          {
            path: ':id/edit',
            element: <EditComment />
          }
        ]
      }
    ]
  }
]);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
