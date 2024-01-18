import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "./usersApi";
import { useEffect, useState } from 'react';
import { createAlert, getErrorMessage} from '../alert/alertSlice';
import { useAppDispatch } from '../../app/hooks';
import { Link } from 'react-router-dom';
import { setCookies } from './cookiesSlice';
import {
    Container,
    Box,
    Button,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    Avatar
} from '@mui/material'
import { LockOutlined } from '@mui/icons-material';


export default function SignIn() {
    const [signIn, {data: authData, isLoading, error, reset}] = useSignInMutation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    function handleSignIn() {
        signIn({
            username: username,
            password: password,
            remember: remember,
        });
    }

    useEffect(() => {
        if (error) {
            dispatch(createAlert({
                severity: "error",
                alert: getErrorMessage(error)
            }))
            reset();
        }

        if (authData) {
            dispatch(setCookies(remember 
                ? {
                    type: "signInRemember",
                    username: authData.username,
                    accessToken: authData.access_token,
                    accessExpiry: authData.access_expiry,
                    refreshToken: authData.refresh_token,
                    refreshExpiry: authData.refresh_expiry
                }
                : {
                    type: "signInForget",
                    username: authData.username,
                    accessToken: authData.access_token,
                    accessExpiry: authData.access_expiry,
                }));
            navigate('/posts/');
        };
    }, [error, authData]);

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                mt: 8,
                mb: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlined />
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