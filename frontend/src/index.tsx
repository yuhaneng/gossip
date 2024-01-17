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
        path: 'posts',
        element: <Outlet />,
        children: []
      },
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
