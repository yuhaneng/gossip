import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { updateUser } from "./usersSlice";
import { resetUsers } from "./usersApi";
import { resetPosts } from "../posts/postsApi";
import { resetComments } from "../comments/commentsApi";
import { resetReplies } from "../replies/repliesApi";
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
        dispatch(resetUsers());
        dispatch(resetPosts());
        dispatch(resetComments());
        dispatch(resetReplies());
        dispatch(updateUser({
            type: "signOut"
        }));
        navigate('/posts');
    }

    return (
        <Container maxWidth='xs'>
            <Box
                sx={{
                mt: 16,
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