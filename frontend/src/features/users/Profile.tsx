import { useEffect } from 'react';
import { SetCookiesData, setCookies } from './cookiesSlice';
import { useDeleteProfileMutation, useGetProfileQuery } from './usersApi';
import { getErrorMessage } from '../../features/alert/alertSlice';
import { createAlert, createAlertData } from '../alert/alertSlice';
import { useAppDispatch } from '../../app/hooks';
import { Link, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Profile() {
    const {data: profile, error: profileError} = useGetProfileQuery();
    const [deleteProfile, {isSuccess: deleteSuccess, error: deleteError}] = useDeleteProfileMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (profileError) {
            const alertData: createAlertData = {
                severity: "error",
                alert: getErrorMessage(profileError)
            }
            dispatch(createAlert(alertData));
        }

        if (deleteError) {
            const alertData: createAlertData = {
                severity: "error",
                alert: getErrorMessage(deleteError)
            }
            dispatch(createAlert(alertData));
        }

        if (deleteSuccess) {
            const cookiesData : SetCookiesData = {
                type: "signOut"
            }
            dispatch(setCookies(cookiesData));
            const alertData: createAlertData = {
                severity : "success",
                alert: "Profile deleted successfully."
            }
            dispatch(createAlert(alertData));
            navigate('/posts');
        }
    }, [profileError, deleteError, deleteSuccess])

    return (
        <Container maxWidth="xs">
            {profile && (<Box
                sx={{
                marginTop: 8,
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