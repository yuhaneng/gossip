import { useNavigate } from "react-router-dom";
import { useSignInMutation, SignInData } from "./usersApi";
import { useEffect, useState } from 'react';
import { createAlert, createAlertData, getErrorMessage} from '../alert/alertSlice';
import { useAppDispatch } from '../../app/hooks';
import { Link } from 'react-router-dom';
import { SetCookiesData, setCookies } from './cookiesSlice';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


export default function SignIn() {
    const [signIn, {data: authData, isLoading, error, reset}] = useSignInMutation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    function handleSignIn() {
        const user : SignInData = {
            username: username,
            password: password,
            remember: remember
        }
        signIn(user);
    }

    useEffect(() => {
        if (error) {
            const alertData: createAlertData = {
                severity: "error",
                alert: getErrorMessage(error)
            }
            dispatch(createAlert(alertData))
            reset();
        }

        if (authData) {
            const cookiesData : SetCookiesData = remember 
                ? {
                    type: "signInRemember",
                    userId: authData.user_id,
                    accessToken: authData.access_token,
                    accessExpiry: authData.access_expiry,
                    refreshToken: authData.refresh_token,
                    refreshExpiry: authData.refresh_expiry
                }
                : {
                    type: "signInForget",
                    userId: authData.user_id,
                    accessToken: authData.access_token,
                    accessExpiry: authData.access_expiry,
                }
            dispatch(setCookies(cookiesData));
            navigate('/posts/');
        };
    }, [error, authData]);

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormControlLabel
                        control={<Checkbox 
                            value="remember" 
                            color="primary" 
                            checked={remember} 
                            onClick={() => setRemember(!remember)}
                        />}
                        label="Remember me"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleSignIn}
                    >
                        Sign In
                    </Button>
                    <Container sx={{display: 'flex', justifyContent: 'center'}}>
                        <Link to='/users/signup'>
                            <Typography sx={{fontSize: "0.8em"}}>
                                New to Gossip? Sign up
                            </Typography>
                        </Link>
                    </Container>
                </Box>
            </Box>
        </Container>
    );
}