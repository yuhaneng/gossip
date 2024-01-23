import { Outlet } from 'react-router-dom';
import Topbar from './features/topbar/Topbar'
import AlertBox from './features/alert/AlertBox';
import './App.css';
import { useAppSelector, useAutoSignIn } from './app/hooks';
import Cookies from 'js-cookie';
import { selectCanRefresh, selectIsSignedIn } from './features/profile/usersSlice';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useGetOwnProfileQuery } from './features/users/usersApi';

const showCookies = false;

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    secondary: {
      main: "#BBB",
      light: "#F0F0F0",
      dark: "#999"
    }
  }
})

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#1976d2",
      light: "#4dabf5",
      dark: "#1769aa"
    },
    secondary: {
      main: "#999",
      light: "#333",
      dark: "#666"
    }
  }
})

export default function App() {
  useAutoSignIn();
  const isSignedIn = useAppSelector(selectIsSignedIn);
  const canRefresh = useAppSelector(selectCanRefresh);
  const {data} = useGetOwnProfileQuery();
  return (
    <ThemeProvider theme={data && data.ui_style ? darkTheme : lightTheme}>
      <CssBaseline />
      {showCookies && (
        <div>
          {Cookies.get("username")}<br />
          {Cookies.get("id")}<br />
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
    </ThemeProvider>
  );
}
