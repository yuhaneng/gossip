import { createBrowserRouter, Outlet, redirect } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../ErrorPage';
import SignUp from '../features/users/SignUp';
import SignIn from '../features/users/SignIn';
import Profile from '../features/profile/Profile';
import EditProfile from '../features/profile/EditProfile';
import UserPosts from '../features/profile/UserPosts';
import Settings from '../features/profile/Settings';
import ChangePassword from '../features/profile/ChangePassword';
import CreatePost from '../features/posts/CreatePost';
import EditPost from '../features/posts/EditPost';
import Post from '../features/posts/Post';
import Posts from '../features/posts/Posts';
import CreateComment from '../features/comments/CreateComment';
import EditComment from '../features/comments/EditComment';
import CreateReply from '../features/replies/CreateReply';
import EditReply from '../features/replies/EditReply';


export default createBrowserRouter([
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          loader: () => redirect('/posts')
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
            }
          ]
        },
        {
          path: 'profile/:id',
          element: <Outlet />,
          children: [
            {
              path: '',
              element: <Profile />
            },
            {
              path: "edit",
              element: <EditProfile />
            },
            {
              path: 'posts',
              element: <UserPosts />
            },
            {
              path: 'settings',
              element: <Settings />
            },
            {
              path: 'password',
              element: <ChangePassword />
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
        },
        {
          path: 'replies',
          element: <Outlet />,
          children: [
            {
              path: 'create/:postId/:commentId',
              element: <CreateReply />
            },
            {
              path: ':id/edit',
              element: <EditReply />
            }
          ]
        }
      ]
    }
  ]);