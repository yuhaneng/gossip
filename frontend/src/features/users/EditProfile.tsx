import { useEffect, useState } from 'react';
import { EditProfileData, useEditProfileMutation, useGetProfileQuery } from './usersApi';
import { useAppDispatch } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { createAlert, createAlertData } from '../alert/alertSlice';
import { getErrorMessage } from '../../features/alert/alertSlice';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function EditProfile() {
    const {data: profile, error: profileError} = useGetProfileQuery();
    const [edit, {isSuccess: editSuccess, error: editError}] = useEditProfileMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    interface FormData {
        username: string,
        email: string,
    }
    const initialFormData: FormData = {
        username: "",
        email: "",
    }
    const [formData, setFormData] = useState(initialFormData);

    interface FormError {
        username: boolean,
        email: boolean,
    }
    const initialFormError: FormError = {
        username: false,
        email: false
    }
    const [formError, setFormError] = useState(initialFormError);

    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username,
                email: profile.email
            })
        }

        if (profileError) {
            const alertData: createAlertData = {
                severity: "error",
                alert: getErrorMessage(profileError)
            }
            dispatch(createAlert(alertData));
        }

        if (editError) {
            const alertData: createAlertData = {
                severity: "error",
                alert: getErrorMessage(editError)
            }
            dispatch(createAlert(alertData));
        }

        if (editSuccess) {
            const alertData: createAlertData = {
                severity : "success",
                alert: "Profile edited successfully."
            }
            dispatch(createAlert(alertData));
            navigate('/users/profile');
        }
    }, [profile, profileError, editError, editSuccess])

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
		} else {
            isValid = true;
        }
        return {isValid, error}
    }
    
    function handleEdit() {
        const {isValid, error} = validateInput();
        if (isValid) {
            const editData: EditProfileData = {
                username: formData.username,
                email: formData.email
            }
            edit(editData);
        } else {
            const alertData: createAlertData = {
				severity: "error",
				alert: error
			}
			dispatch(createAlert(alertData));
        }
    }

    function handleInput(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
        if ((name === "username" || name === "email" ) && formError[name]) {
            handleError(name, false)
        }
    }

    function handleError(name: "username" | "email", value: boolean) {
        setFormError({
            ...formError,
            [name]: value
        })
    }

    return (
        <Container maxWidth="sm">
            {profile && (
                <Box component="form" noValidate sx={{ 
                    mt: 8, 
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
                        onChange={handleInput}
                        error={formError.username}
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
                        onChange={handleInput}
                        error={formError.email}
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 5, mb: 2, width: '60%'}}
                        onClick={handleEdit}
                    >
                        Edit Profile
                    </Button>
                </Box>
            )}
        </Container>
    )
}