import {
    Container,
    Box,
    Button,
    TextField,
    Typography,
    Grid
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useCheckSignedIn, useErrorAlert, useFormHandler, useOnSuccess } from '../../app/hooks'
import { useChangePasswordMutation } from '../users/usersApi'
import { validatePassword } from '../../app/validations';
import { createAlert } from '../alert/alertSlice';

export default function ChangePassword() {
    // Redirect user to sign in page if not signed in.
    useCheckSignedIn();

    const dispatch = useAppDispatch();

    // Get change password trigger, isSuccess and error states.
    const [change, {isSuccess, error}] = useChangePasswordMutation();

    // Get user id from page's path.
    const {id = ""} = useParams();

    // Create error alert if change password fails.
    useErrorAlert(error);

    // Create success alert and redirect to settings page if change password successful.
    useOnSuccess(isSuccess, "Changed password successfully.", `/profile/${id}/settings`)

    // To handle form data and errors.
    interface FormData {
       oldPassword: string,
       password: string,
       confirmPassword: string
    }
    const {formData, formError, handleInput, handleError} = useFormHandler<FormData>({
       oldPassword: "",
       password: "",
       confirmPassword: ""
    })

    // Validate form data and create error alert or use change password mutation.
    function handleChange() {
        const passwordError = validatePassword(formData.password, formData.confirmPassword);
        if (passwordError) {
            handleError({password: true})
            dispatch(createAlert({
				severity: "error",
				alert: passwordError
			}));
        } else {
            change({
                id: id,
                oldPassword: formData.oldPassword,
                password: formData.password
            })
        }
    }

    return (
        <Container maxWidth="xs">
            <Box component="form" noValidate sx={{ 
                mt: 12,
                mb: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'}}
            >
                <Typography variant="h4" sx={{fontWeight: 800, mt: 3}}>
                    Change Password
                </Typography>
                <Box component="form" noValidate sx={{ mt: 8 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
							required
							fullWidth
							id="oldpassword"
							label="Old Password"
							name="old password"
							value={formData.oldPassword}
							onChange={(e) => handleInput({oldPassword: e.target.value})}
							error={formError.oldPassword}
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
					</Grid>
					<Button
						fullWidth
						variant="contained"
						sx={{ mt: 8 }}
						onClick={handleChange}
					>
						Change Password
					</Button>
					<Link to={`/profile/${id}/settings`}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2, bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark'} }}
                        >
                            Cancel
                        </Button>
                    </Link>
				</Box>
            </Box>
        </Container>
    )
}