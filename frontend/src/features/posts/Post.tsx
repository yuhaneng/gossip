import { useParams, Link } from 'react-router-dom';
import { useGetPostQuery, useDeletePostMutation, useVotePostMutation } from "./postsApi";
import { useCheckCorrectUserRelax, useErrorAlert, useOnSuccess } from '../../app/hooks';
import { useState } from 'react';
import Comments from '../comments/Comments';
import Confirmation from '../alert/Confirmation';
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
    // Get post id from page's path.
    const { id = "0" } = useParams();

    // Get post by id.
    const { data: post, error: postError } = useGetPostQuery(id)

    // Get delete and vote post triggers, isSuccess and error states.
    const [deletePost, {isSuccess: deleteSuccess, error: deleteError}] = useDeletePostMutation();
    const [votePost, { error: voteError}] = useVotePostMutation();

    // Is the signed in user the author of the post or an admin.
    const isAuthor = useCheckCorrectUserRelax(post ? post.author_id : "");

    // To toggle the options menu.
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // To toggle the confirmation menu.
    const [openConfirm, setOpenConfirm] = useState(false);

    // Create error alerts if get, delete or vote post fails.
    useErrorAlert(postError);
    useErrorAlert(deleteError);
    useErrorAlert(voteError);

    // Create success alert and redirect to posts page if delete post successful.
    useOnSuccess(deleteSuccess, "Post deleted successfully.", "/posts")

    // Use vote mutation.
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
                mt: 12,
                mb: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left'
                }}
            >
                {post && (
                    <Box >
                        <Confirmation 
                            title="Confirm Delete" 
                            content="Are you sure you want to delete this post?" 
                            open={openConfirm}
                            setOpen={setOpenConfirm}
                            action={() => deletePost(id)}
                        />
                        <Box sx={{border: '1px solid #EEE', borderColor: 'secondary.dark', p: 4, borderRadius: 3}}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h3" component="h2" sx={{fontSize: '2em', fontWeight: 800, mb: 0.5, wordBreak: 'break-all'}}>
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

                                    <MenuItem onClick={() => setOpenConfirm(true)}>Delete Post</MenuItem>
                                </Menu>
                                </Box>}
                            </Box>
                            <Stack direction="row" sx={{mb: 1.5}}>
                                <Link to={post.author_id ? `/profile/${post.author_id}` : ''}>
                                    <IconButton size="small">
                                        {post.author
                                            ? (<Avatar>{post.author[0].toUpperCase()}</Avatar>)
                                            : (<Avatar />)
                                        }
                                    </IconButton>
                                </Link>
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
                                    Back to Posts
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