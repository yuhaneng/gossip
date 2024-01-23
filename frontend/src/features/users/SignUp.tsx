import { useNavigate } from "react-router-dom";
import { useSignUpMutation } from "./usersApi";
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createAlert } from '../alert/alertSlice';
import { useAppDispatch, useErrorAlert, useFormHandler } from '../../app/hooks';
import { updateUser } from '../profile/usersSlice';
import { validateEmail, validatePassword, validateUsername } from "../../app/validations";
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
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

	// Get signup trigger, data and error states.
    const [signUp, {data: authData, error}] = useSignUpMutation();

	// Create error alert if sign up fails.
	useErrorAlert(error);

	// To handle form data and errors.
    interface FormData {
        username: string,
        email: string,
        password: string,
        confirmPassword: string,
		remember: boolean
    }
    const {formData, formError, handleInput, handleError} = useFormHandler<FormData>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
		remember: false
    })

	// Update store and create success alert and redirect to posts page if sign up successful.
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
            dispatch(createAlert({
                severity : "success",
                alert: "Welcome to Gossip."
            }));
			navigate('/posts/');
		};
	}, [authData])

	// Validate form data and create error alert or use sign up mutation.
    function handleSignUp() {
		const usernameError = validateUsername(formData.username);
		const emailError = validateEmail(formData.email);
		const passwordError = validatePassword(formData.password, formData.confirmPassword);
		if (usernameError) {
			dispatch(createAlert({
				severity: "error",
				alert: usernameError
			}));
		} else if (emailError) {
			dispatch(createAlert({
				severity: "error",
				alert: emailError
			}));
		} else if (passwordError) {
			dispatch(createAlert({
				severity: "error",
				alert: passwordError
			}));
		} else {
			signUp(formData);
		}
		handleError({
			username: !!usernameError, 
			email: !!emailError,
			password: !!passwordError
		})
    }

    return (
      	<Container component="main" maxWidth="xs">
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
							onChange={(e) => handleInput({username: e.target.value})}
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
							onChange={(e) => handleInput({email: e.target.value})}
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
							onChange={(e) => handleInput({password: e.target.value})}
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
							onChange={(e) => handleInput({confirmPassword: e.target.value})}
							error={formError.password}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControlLabel
								control={<Checkbox 
									value="remember" 
									color="primary" 
									checked={formData.remember} 
									onClick={() => handleInput({remember: !formData.remember})}
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