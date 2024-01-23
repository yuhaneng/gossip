import {
    Container,
    Box,
    Button,
    Typography,
    Switch,
    Grid
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { useCheckSignedIn, useErrorAlert } from '../../app/hooks';
import { useChangeSettingsMutation, useGetProfileQuery } from '../users/usersApi';
import { useEffect, useState } from 'react';

export default function Settings() {
    // Redirect user to sign in page if not signed in.
    useCheckSignedIn();

    // Get user id from page's path.
    const {id = ""} = useParams();

    // Get change settings trigger and error state.
    const [change, {error}] = useChangeSettingsMutation();

    // Get profile by user id.
    const {data: profile} = useGetProfileQuery(id);

    // Form data state.
    const [uiStyle, setUiStyle] = useState(false);
    const [privacy, setPrivacy] = useState(false);

    // Autofill form data when profile is received.
    useEffect(() => {
        if (profile) {
            setUiStyle(profile.ui_style);
            setPrivacy(profile.privacy)
        }
    }, [profile])

    // Create error alert if change settings fails.
    useErrorAlert(error);

    // Use change settings mutation upon change in form data.
    useEffect(() => {
        change({
            id: id,
            uiStyle: uiStyle,
            privacy: privacy
        })
    }, [uiStyle, privacy])
    
    return (
        <Container maxWidth="sm"> 
            <Box component="form" noValidate sx={{ 
                mt: 12,
                mb: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'}}
            >
                <Typography variant="h4" sx={{fontWeight: 800, mt: 3}}>
                    Settings
                </Typography>
                <Grid container rowSpacing={3} sx={{mt: 5}}>
                    <Grid item xs={8}>
                        <Typography sx={{fontSize: '1.5em', fontWeight: '600'}}>
                            UI Style
                        </Typography>
                    </Grid>
                    <Grid item container xs={4} alignItems="center">
                        <Grid item xs={4}>
                            <Typography sx={{fontSize: '1.2em', fontWeight: '400'}}>
                                Light
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Switch 
                                checked={uiStyle} 
                                onClick={() => setUiStyle(!uiStyle)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography sx={{fontSize: '1.2em', fontWeight: '400'}}>
                                Dark
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography sx={{fontSize: '1.5em', fontWeight: '600'}}>
                            Privacy
                        </Typography>
                    </Grid>
                    <Grid item container xs={4} alignItems="center">
                        <Grid item xs={4}>
                            <Typography sx={{fontSize: '1.2em', fontWeight: '400'}}>
                                Private
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Switch 
                                checked={privacy}
                                onClick={() => setPrivacy(!privacy)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography sx={{fontSize: '1.2em', fontWeight: '400'}}>
                                Public
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid xs={12}>
                        <Typography variant="body1" sx={{fontSize: '0.9em', color: 'grey'}}>
                            In Public mode, other users will be able to see your profile page.
                        </Typography>
                    </Grid>
                </Grid>
                <Box sx={{mt: 8}}>
                    <Link to={`/profile/${id}/password`}>
                        <Button variant="contained">
                            Change Password
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Container>
    )
}