import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useGetPostQuery, useDeletePostMutation, useVotePostMutation } from "./postsApi";
import { getErrorMessage } from '../../features/alert/alertSlice';
import { createAlert } from '../alert/alertSlice';
import { useAppDispatch, useAutoSignIn, useCheckCorrectUserRelax } from '../../app/hooks';
import { useEffect, useState } from 'react';
import Comments from '../comments/Comments';
import {
    Container,
    Box,
    Stack,
    Button,
    IconButton,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    Divider
} from '@mui/material';
import {
    MoreVert,
    ThumbUp,
    ThumbDown
} from '@mui/icons-material';

export default function Post() {
    const { id = "0" } = useParams();
    const { data: post, isLoading: postLoading, error: postError } = useGetPostQuery(id)
    const [deletePost, {isSuccess: deleteSuccess, isLoading: deleteLoading, error: deleteError}] = useDeletePostMutation();
    const [votePost, {isSuccess: voteSuccess, isLoading: voteLoading, error: voteError}] = useVotePostMutation();
    useAutoSignIn();
    const isAuthor = useCheckCorrectUserRelax(post ? post.author : "");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        if (postError) {
            dispatch(createAlert({
                severity: "error",
                alert: getErrorMessage(postError)
            }));
        } 
        if (deleteError) {
            dispatch(createAlert({
                severity: "error",
                alert: getErrorMessage(deleteError)
            }));
        }
        if (voteError) {
            dispatch(createAlert({
                severity: "error",
                alert: getErrorMessage(voteError)
            }));
        }
        if (deleteSuccess) {
            dispatch(createAlert({
                severity : "success",
                alert: "Post deleted successfully."
            }));
            navigate('/posts')
        }
    }, [postError, deleteError, voteError, deleteSuccess])

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleVote(vote: "up" | "down") {
        if (post) {
            if (post.user_vote === vote) {
                votePost({id: id, vote: "none"})
            } else {
                votePost({id: id, vote: vote})
            }
        }
    }

    return (
        <Container maxWidth="sm" >
            <Box
                sx={{
                mt: 4,
                mb: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left'
                }}
            >
                {post && (
                    <Box >
                        <Box sx={{border: '1px solid #EEE', p: 4, borderRadius: 3}}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h3" component="h2" sx={{fontSize: '3em', fontWeight: 800, mb: 0.5}}>
                                    {post.title}
                                </Typography>
                                {isAuthor && <Box>
                                <IconButton
                                    size="large"
                                    aria-label="options"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <MoreVert sx={{color: "#AAA"}} />
                                </IconButton>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <Link to={`/posts/${id}/edit`} style={{textDecoration: 'none', color: 'inherit'}}>
                                        <MenuItem>Edit Post</MenuItem>
                                    </Link>

                                    <MenuItem onClick={() => deletePost(id)}>Delete Post</MenuItem>
                                </Menu>
                                </Box>}
                            </Box>
                            <Stack direction="row" sx={{mb: 1.5}}>
                                <Avatar />
                                <Box sx={{ml: 1}}>
                                    <Typography variant="caption" component="p" color="#666">
                                        {post.author ? post.author : "[Deleted Account]"} 
                                    </Typography>
                                    <Typography variant="caption" component="p" color="#666">
                                        {post.created_at.slice(0,10) + (post.updated_at !== post.created_at ? ` • ( Edited ${post.updated_at.slice(0,10)} )` : "")}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Typography component="p" sx={{wordBreak: "break-word", mb: 2, p: 1}}>
                                {post.content}
                            </Typography>
                            <Typography variant="caption" color="#888" component="p" sx={{mt: 5}}>
                                    {post.tags.map((tag) => `#${tag}   `)}
                            </Typography>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mt: 1}}>
                                <ThumbUp 
                                    onClick={() => handleVote("up")} 
                                    sx={{
                                        color: post.user_vote === "up" ? "#1976d2": "#AAA", 
                                        fontSize: "0.8em", 
                                        '&:hover': {color: post.user_vote === "up" ? "#1976d2": "#666", }
                                    }}
                                />
                                <Typography variant="caption" color="#888">{post.upvotes}</Typography>
                                <Typography variant="caption" color="#888"> • </Typography>
                                <ThumbDown 
                                    onClick={() => handleVote("down")} 
                                    sx={{
                                        color: post.user_vote === "down" ? "#f44336": "#AAA", 
                                        fontSize: "0.8em", 
                                        '&:hover': {color: post.user_vote === "down" ? "#f44336": "#666", }
                                    }}
                                />
                                <Typography variant="caption" color="#888">{post.downvotes}</Typography>
                            </Box>
                            <Link to="/posts">
                                <Button variant="outlined" size="small" sx={{right: 10, mt: 3}}>
                                    Back To Posts
                                </Button>
                            </Link>
                        </Box>
                        <Divider sx={{mt: 8}}/>
                        <Box sx={{
                            mt: 1,
                            pl: 1, 
                            pr: 1, 
                        }}>
                            <Comments postId={id} />
                        </Box>
                    </Box>
                )}
            </Box>
        </Container>
    )
}