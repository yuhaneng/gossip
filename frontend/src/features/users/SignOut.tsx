import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { SetCookiesData, setCookies } from "./cookiesSlice";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function SignOut() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    function handleSignOut() {
        const cookiesData : SetCookiesData = {
            type: "signOut"
        }
        dispatch(setCookies(cookiesData));
        navigate('/posts');
    }

    return (
        <Container maxWidth='xs'>
            <Box
                sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
            <Typography component="h1" variant="h5" sx={{mb: 4}}>
                Sign Out
            </Typography>
            <Typography component="h1" variant="body1" sx={{mb: 4}}>
                Are you sure you want to sign out?
            </Typography>
            <Button
                variant="contained"
                sx={{ width: 80}}
                onClick={handleSignOut}
            >Yes</Button>
            </Box>
        </Container>
    );
}