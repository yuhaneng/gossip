import { useEditProfileMutation, useGetProfileQuery } from './usersApi';
import { useAppDispatch, useErrorAlert, useFormHandler, useOnSuccess } from '../../app/hooks';
import { Link } from 'react-router-dom';
import { createAlert } from '../alert/alertSlice';
import { validateEmail, validateUsername } from '../../app/validations';
import {
    Container,
    Box,
    Button,
    TextField,
    Avatar
} from '@mui/material'

export default function EditProfile() {
    const dispatch = useAppDispatch();

    const {data: profile, error: profileError} = useGetProfileQuery();
    const [edit, {isSuccess: editSuccess, error: editError}] = useEditProfileMutation();

    interface FormData {
        username: string,
        email: string
    }
    const {formData, formError, handleInput, handleError} = useFormHandler<FormData>({
        username: "",
        email: ""
    }, profile);

    useErrorAlert(profileError);
    useErrorAlert(editError);
    useOnSuccess(editSuccess, "Profile edited successfully", '/users/profile');
    
    function handleEdit() {
        const usernameError = validateUsername(formData.username);
        const emailError = validateEmail(formData.email);
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
        } else {
            edit({
                username: formData.username,
                email: formData.email
            });
        }
        handleError({username: !!usernameError, email: !!emailError})
    }

    return (
        <Container maxWidth="sm">
            
                <Box component="form" noValidate sx={{ 
                    mt: 12,
					mb: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'}}
                >
                    <Avatar sx={{width: 100, height: 100}} />
                    <TextField
                        margin="normal"
                        id="username"
                        label="Username"
                        name="username"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        autoFocus
                        sx={{width: '60%', mt: 5}}
                        value={formData.username}
                        onChange={(event) => handleInput({username: event.target.value})}
                        error={formError.username}
                        disabled={!profile}
                    />
                    <TextField
                        margin="normal"
                        id="email"
                        label="Email"
                        name="email"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        autoFocus
                        sx={{width: '60%', mt: 5}}
                        value={formData.email}
                        onChange={(event) => handleInput({email: event.target.value})}
                        error={formError.email}
                        disabled={!profile}
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 5, width: '60%'}}
                        onClick={handleEdit}
                        disabled={!profile}
                    >
                        Edit Profile
                    </Button>
                    <Box sx={{width: '60%'}}>
                    <Link to="/users/profile">
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: '#BBB', '&:hover': { bgcolor: '#888'} }}
                        >
                            Cancel
                        </Button>
                    </Link>
                    </Box>
                </Box>
        </Container>
    )
}