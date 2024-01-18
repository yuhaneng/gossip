import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { setCookies } from "./cookiesSlice";
import {
    Container,
    Box,
    Button,
    Typography
} from '@mui/material'

export default function SignOut() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    function handleSignOut() {
        dispatch(setCookies({
            type: "signOut"
        }));
        navigate('/posts');
    }

    return (
        <Container maxWidth='xs'>
            <Box
                sx={{
                mt: 8,
                mb: 16,
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