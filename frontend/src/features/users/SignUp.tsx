import { useNavigate } from "react-router-dom";
import { useSignUpMutation } from "./usersApi";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createAlert, getErrorMessage } from '../alert/alertSlice';
import { useAppDispatch } from '../../app/hooks';
import { setCookies } from './cookiesSlice';
import {
	Container,
	Box,
	Grid,
	Button,
	Typography,
	TextField,
	FormControlLabel,
	Checkbox,
	Avatar
} from '@mui/material';
import {LockOutlined} from '@mui/icons-material'

export default function SignUp() {
    const [signUp, {data: authData, isLoading, error, reset}] = useSignUpMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
	const [remember, setRemember] = useState(false)

    interface FormData {
        username: string,
        email: string,
        password: string,
        confirmPassword: string
    }
    const initialFormData: FormData = {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    }
    const [formData, setFormData] = useState(initialFormData);

	interface FormError {
		username: boolean,
		email: boolean,
		password: boolean
	}
	const initialFormError: FormError = {
		username: false,
		email: false,
		password: false
	}
	const [formError, setFormError] = useState(initialFormError)

	useEffect(() => {
		if (error) {
			  dispatch(createAlert({
				severity: "error",
				alert: getErrorMessage(error)
				}))
			  reset();
		  };

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
            dispatch(createAlert({
                severity : "success",
                alert: "Welcome to Gossip. To continue setting up your profile, click here."
            }));
			navigate('/posts/');
		};
	}, [error, authData])

    function handleInput(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
		if ((name === "username" || name === "email" || name === "password") && formError[name]) {
            handleError(name, false)
        }
    }

	function handleError(name: "username" | "email" | "password", value: boolean) {
		setFormError({
            ...formError,
            [name]: value
        })
	}

	const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

	function validateInput() {
		let isValid = false;
		let error = "";
		if (formData.username.length === 0) {
			handleError("username", true);
			error = "Username is required."
		} else if (!formData.username.match(/^\w*$/)) {
			handleError("username", true);
			error = "Username cannot contain special characters."
		} else if (formData.username.length > 20) {
			handleError("username", true);
			error = "Username too long. Maximum 20 characters."
		} else if (formData.email.length === 0) {
			handleError("email", true);
			error = "Email is required."
		} else if (!formData.email.match(emailRegex)) {
			handleError("email", true);
			error = "Email not valid."
		} else if (formData.password.length === 0) {
			handleError("password", true);
			error = "Password is required."
		} else if (formData.password !== formData.confirmPassword) {
			handleError("password", true);
			error = "Password and Confirm Password do not match."
		} else {
			isValid = true;
		}
		return {isValid, error}
	}

    function handleSignUp() {
		const {isValid, error} = validateInput();
		if (isValid) {
			signUp({
				username: formData.username,
				email: formData.email,
				password: formData.password,
				remember: remember
			});
		} else {
			dispatch(createAlert({
				severity: "error",
				alert: error
			}));
		}
    }

    return (
      	<Container component="main" maxWidth="xs">
        	<Box
				sx={{
					mt: 4,
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
					Sign Up
				</Typography>
				<Box component="form" noValidate sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
							name="username"
							required
							fullWidth
							id="username"
							label="Username"
							autoFocus
							value={formData.username}
							onChange={handleInput}
							error={formError.username}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							value={formData.email}
							onChange={handleInput}
							error={formError.email}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="new-password"
							value={formData.password}
							onChange={handleInput}
							error={formError.password}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
							required
							fullWidth
							name="confirmPassword"
							label="Confirm Password"
							type="password"
							id="confirm-password"
							autoComplete="new-password"
							value={formData.confirmPassword}
							onChange={handleInput}
							error={formError.password}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControlLabel
								control={<Checkbox 
									value="remember" 
									color="primary" 
									checked={remember} 
									onClick={() => setRemember(!remember)}
								/>}
								label="Remember me"
							/>
						</Grid>
					</Grid>
					<Button
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
						onClick={handleSignUp}
					>
						Sign Up
					</Button>
					<Grid container justifyContent="center">
						<Grid item>
							<Link to='/users/signin'>
								<Typography sx={{fontSize: "0.8em"}}>
									Already have an account? Sign in
								</Typography>
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
}