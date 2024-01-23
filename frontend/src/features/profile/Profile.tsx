import { resetUsers, useDeleteProfileMutation, useGetProfileQuery } from '../users/usersApi';
import { useAppDispatch, useAppSelector, useCheckCorrectUserRelax, useErrorAlert, useOnSuccess } from '../../app/hooks';
import { Link, useParams } from 'react-router-dom';
import { resetPosts } from '../posts/postsApi';
import { resetComments } from '../comments/commentsApi';
import { resetReplies } from '../replies/repliesApi';
import { selectId, updateUser } from './usersSlice';
import {
    Container,
    Box,
    Button,
    Typography,
    Avatar
} from '@mui/material'

export default function Profile() {
    const dispatch = useAppDispatch();

    // Get user id from store.
    const userId = useAppSelector(selectId);

    // Get profile id from page's path.
    const {id = ""} = useParams();

    // Get profile by id.
    const {data: profile, error: profileError} = useGetProfileQuery(id);

    // Get delete profile trigger, isSuccess and error states.
    const [deleteProfile, {isSuccess: deleteSuccess, error: deleteError}] = useDeleteProfileMutation();

    // Is the signed in user the owner of the profile or an admin.
    const isCorrectUser = useCheckCorrectUserRelax(id);

    // Create error alerts if get or delete profile fails.
    useErrorAlert(profileError);
    useErrorAlert(deleteError);

    // Create success alert, redirect to posts page if delete profile successful
    // and reset all Api caches and store if profile deleted is signed in user's.
    useOnSuccess(deleteSuccess, "Profile deleted successfully.", '/posts', () => {
        if (id === userId) {
            dispatch(resetUsers());
            dispatch(resetPosts());
            dispatch(resetComments());
            dispatch(resetReplies());
            dispatch(updateUser({
                type: "signOut"
            }));
        }
    });

    return (
        <Container maxWidth="xs">
            {profile && (<Box
                sx={{
                mt: 12,
                mb: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
                }}
            >
                <Avatar sx={{
                    width: 100, 
                    height: 100, 
                    fontSize: '3em',
                    bgcolor: '#1976d2'
                }}>
                    {profile.username[0].toUpperCase()}
                </Avatar>
                <Typography variant="h4" sx={{fontWeight: 800, mt: 3}}>
                    {profile.username}
                </Typography>
                {profile.email && (<Typography variant="body1" component="p" sx={{mt: 3, fontWeight: 600}}>
                    Email: 
                </Typography>)}
                {profile.email && (<Typography variant="body1" component="p" sx={{mt: 0.5}}>
                    {profile.email}
                </Typography>)}
                {profile.about && (
                    <Typography variant="body1" component="p" sx={{mt: 3, fontWeight: 600}}>
                        About: 
                    </Typography>
                )}
                {profile.about && (
                    <Typography variant="body1" component="p" sx={{mt: 0.5}}>
                        {profile.about}
                    </Typography>
                )}
                {isCorrectUser && (
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
                            onClick={() => deleteProfile(id)}
                            sx={{width: 140}}>
                            Delete Profile
                        </Button>
                    </Box>
                )}
                <Link to={`/profile/${id}/posts`} >
                    <Button size="small" variant="contained" sx={{mt: 5, width: 140}}>
                        View Posts
                    </Button>
                </Link>
            </Box>)}
        </Container>
    )
}