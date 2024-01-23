import { useEditProfileMutation, useGetProfileQuery } from '../users/usersApi';
import { useAppDispatch, useCheckCorrectUserStrict, useCheckSignedIn, useErrorAlert, useFormHandler, useOnSuccess } from '../../app/hooks';
import { Link, useParams } from 'react-router-dom';
import { createAlert } from '../alert/alertSlice';
import { validateAbout, validateEmail, validateUsername } from '../../app/validations';
import {
    Container,
    Box,
    Button,
    TextField,
    Avatar
} from '@mui/material'

export default function EditProfile() {
    // Redirect user to sign in page if not signed in.
    useCheckSignedIn();

    const dispatch = useAppDispatch();

    // Get user id from page's path.
    const {id = ""} = useParams();

    // Get profile by user id.
    const {data: profile, error: profileError} = useGetProfileQuery(id);

    // Get edit profile trigger, isSuccess and error states.
    const [edit, {isSuccess: editSuccess, error: editError}] = useEditProfileMutation();

    // To handle form data and errors.
    interface FormData {
        username: string,
        email: string,
        about: string
    }
    const {formData, formError, handleInput, handleError} = useFormHandler<FormData>({
        username: "",
        email: "",
        about: ""
    }, profile);

    // Create error alerts if get or edit profile fails.
    useErrorAlert(profileError);
    useErrorAlert(editError);

    // Create success alert and redirect to profile page if edit profile successful.
    useOnSuccess(editSuccess, "Profile edited successfully", `/profile/${id}`);
    
    // Validate form data and create error alert or use edit mutation.
    function handleEdit() {
        const usernameError = validateUsername(formData.username);
        const emailError = validateEmail(formData.email);
        const aboutError = validateAbout(formData.about);
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
        } else if (aboutError) {
            dispatch(createAlert({
                severity: "error",
                alert: aboutError
            }))
        } else {
            edit({
                id: id,
                username: formData.username,
                email: formData.email,
                about: formData.about
            });
        }
        handleError({username: !!usernameError, email: !!emailError, about: !!aboutError})
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
                   <Avatar sx={{
                        width: 100, 
                        height: 100, 
                        fontSize: '3em',
                        bgcolor: '#1976d2'
                    }}>
                        {formData.username ? formData.username[0].toUpperCase() : ""}
                    </Avatar>
                    <TextField
                        margin="normal"
                        label="Username"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{width: '60%', mt: 5}}
                        value={formData.username}
                        onChange={(event) => handleInput({username: event.target.value})}
                        error={formError.username}
                        disabled={!profile}
                    />
                    <TextField
                        margin="normal"
                        label="Email"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{width: '60%', mt: 5}}
                        value={formData.email}
                        onChange={(event) => handleInput({email: event.target.value})}
                        error={formError.email}
                        disabled={!profile}
                    />
                    <TextField
                        margin="normal"
                        label="About"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{width: '60%', mt: 5}}
                        multiline
                        rows={8}
                        value={formData.about}
                        onChange={(event) => handleInput({about: event.target.value})}
                        error={formError.about}
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
                    <Link to={`/profile/${id}`}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark'} }}
                        >
                            Cancel
                        </Button>
                    </Link>
                    </Box>
                </Box>
        </Container>
    )
}