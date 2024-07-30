import { Outlet } from 'react-router-dom';
import Topbar from './features/topbar/Topbar'
import AlertBox from './features/alert/AlertBox';
import './App.css';
import { useAutoSignIn } from './app/hooks';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useGetOwnProfileQuery } from './features/users/usersApi';

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
  const {data} = useGetOwnProfileQuery();
  return (
    <ThemeProvider theme={data && data.ui_style === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      <Topbar />
      <AlertBox />
      <Outlet />
    </ThemeProvider>
  );
}
