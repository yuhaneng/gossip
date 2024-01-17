import { Outlet } from 'react-router-dom';
import Topbar from './features/topbar/Topbar'
import AlertBox from './features/alert/AlertBox';
import './App.css';
import { useAppDispatch, useAppSelector, useAutoSignIn } from './app/hooks';
import Cookies from 'js-cookie';
import { checkCookies, selectCanRefresh, selectIsSignedIn } from './features/users/cookiesSlice';

export default function App() {
  useAutoSignIn();
  const isSignedIn = useAppSelector(selectIsSignedIn);
  const canRefresh = useAppSelector(selectCanRefresh);
  const dispatch = useAppDispatch();
  return (
    <div className="App">
      {Cookies.get("accessToken")}<br />
      {Cookies.get("refreshToken")}<br />
      {Cookies.get("accessExpiry")}<br />
      {Cookies.get("refreshExpiry")}<br />
      {Math.round(Date.now() / 1000)}<br />
      {isSignedIn ? "Signed In" : "Not Signed In"} <br />
      {canRefresh ? "Can Refresh" : "Cannot Refresh"} <br />
      <Topbar />
      <AlertBox />
      <Outlet />
    </div>
  );
}
