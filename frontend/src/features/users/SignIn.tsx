import { useNavigate } from "react-router-dom";
import usersApi, { useSignInMutation } from "./usersApi";
import { useEffect } from 'react';
import { useAppDispatch, useErrorAlert, useFormHandler } from '../../app/hooks';
import { Link } from 'react-router-dom';
import { updateUser } from '../profile/usersSlice';
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
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Get signin trigger, data and error states.
    const [signIn, {data: authData, error}] = useSignInMutation();

    // To handle form data and errors.
    interface FormData {
        username: string,
        password: string,
        remember: boolean
    }
    const {formData, formError, handleInput, handleError} = useFormHandler<FormData>({
        username: "",
        password: "",
        remember: false
    })

    // Create error alert if sign in fails.
    useErrorAlert(error);

    // Set username and password fields error to true if sign in fails.
    useEffect(() => {
        if (error) {
            handleError({username: true, password: true})
        }
    }, [error])

    // Use sign in mutation.
    function handleSignIn() {
        signIn(formData);
    }

    // Update store and redirect to posts page if sign in successful.
    useEffect(() => {
        if (authData) {
            dispatch(updateUser(formData.remember 
                ? {
                    type: "signInRemember",
                    id: authData.id,
                    username: authData.username,
                    admin: authData.admin,
                    accessToken: authData.access_token,
                    accessExpiry: authData.access_expiry,
                    refreshToken: authData.refresh_token,
                    refreshExpiry: authData.refresh_expiry
                }
                : {
                    type: "signInForget",
                    id: authData.id,
                    username: authData.username,
                    admin: authData.admin,
                    accessToken: authData.access_token,
                    accessExpiry: authData.access_expiry,
                }));
            navigate('/posts/');
        };
    }, [authData]);

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                mt: 12,
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
                        value={formData.username}
                        onChange={(e) => handleInput({username: e.target.value})}
                        error={formError.username}
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
                        value={formData.password}
                        onChange={(e) => handleInput({password: e.target.value})}
                        error={formError.password}
                    />
                    <FormControlLabel
                        control={<Checkbox 
                            value="remember" 
                            color="primary" 
                            checked={formData.remember} 
                            onClick={(e) => handleInput({remember: !formData.remember})}
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