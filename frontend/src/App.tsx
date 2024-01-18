import { Outlet } from 'react-router-dom';
import Topbar from './features/topbar/Topbar'
import AlertBox from './features/alert/AlertBox';
import './App.css';
import { useAppDispatch, useAppSelector, useAutoSignIn } from './app/hooks';
import Cookies from 'js-cookie';
import { selectCanRefresh, selectIsSignedIn } from './features/users/cookiesSlice';

const showCookies = false;

export default function App() {
  useAutoSignIn();
  const isSignedIn = useAppSelector(selectIsSignedIn);
  const canRefresh = useAppSelector(selectCanRefresh);
  return (
    <div className="App">
      {showCookies && (
        <div>
          {Cookies.get("username")}<br />
          {Cookies.get("accessToken")}<br />
          {Cookies.get("refreshToken")}<br />
          {Cookies.get("accessExpiry")}<br />
          {Cookies.get("refreshExpiry")}<br />
          {Math.round(Date.now() / 1000)}<br />
          {isSignedIn ? "Signed In" : "Not Signed In"} <br />
        {canRefresh ? "Can Refresh" : "Cannot Refresh"} <br />
        </div>
      )}
      <Topbar />
      <AlertBox />
      <Outlet />
    </div>
  );
}
