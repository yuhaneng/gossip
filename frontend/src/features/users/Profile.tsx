import { useEffect } from 'react';
import { setCookies } from './cookiesSlice';
import { useDeleteProfileMutation, useGetProfileQuery } from './usersApi';
import { getErrorMessage } from '../../features/alert/alertSlice';
import { createAlert } from '../alert/alertSlice';
import { useAppDispatch } from '../../app/hooks';
import { Link, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Button,
    Typography,
    Avatar
} from '@mui/material'

export default function Profile() {
    const {data: profile, error: profileError} = useGetProfileQuery();
    const [deleteProfile, {isSuccess: deleteSuccess, error: deleteError}] = useDeleteProfileMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (profileError) {
            dispatch(createAlert({
                severity: "error",
                alert: getErrorMessage(profileError)
            }));
        }

        if (deleteError) {
            dispatch(createAlert({
                severity: "error",
                alert: getErrorMessage(deleteError)
            }));
        }

        if (deleteSuccess) {
            dispatch(setCookies({
                type: "signOut"
            }));
            dispatch(createAlert({
                severity : "success",
                alert: "Profile deleted successfully."
            }));
            navigate('/posts');
        }
    }, [profileError, deleteError, deleteSuccess])

    return (
        <Container maxWidth="xs">
            {profile && (<Box
                sx={{
                mt: 8,
                mb: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
                }}
            >
                <Avatar sx={{width: 100, height: 100}} />
                <Typography variant="h4" sx={{fontWeight: 800, mt: 3}}>
                    {profile.username}
                </Typography>
                <Typography variant="body1" component="p" sx={{mt: 3, fontWeight: 600}}>
                    Email: 
                </Typography>
                <Typography variant="body1" component="p" sx={{mt: 0.5}}>
                    {profile.email}
                </Typography>
                <Box sx={{
                    display: 'flex', 
                    justifyContent: 'space-evenly', 
                    alignItems: 'center', 
                    gap: 2,
                    mt: 5}}
                >
                    <Link to={'edit'}>
                        <Button size="small" variant="contained" sx={{width: 140}}>
                            Edit Profile
                        </Button>
                    </Link>
                    <Button 
                        size="small" 
                        variant="contained" 
                        color="error" 
                        onClick={() => deleteProfile()}
                        sx={{width: 140}}>
                        Delete Profile
                    </Button>
                </Box>
            </Box>)}
        </Container>
    )
}