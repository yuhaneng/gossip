import { useState } from "react";
import { useAppDispatch, useCheckCorrectUserRelax, useErrorAlert, useOnSuccess } from "../../app/hooks";
import { ReplyData, useDeleteReplyMutation, useVoteReplyMutation } from "./repliesApi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { 
    Container,
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Grid
 } from '@mui/material';
 import {
    ThumbUp,
    ThumbDown,
    MoreVert
} from '@mui/icons-material'

export default function ReplyPreview(props: {reply: ReplyData}) {
    const reply = props.reply;

    // Is the signed in user the author of the reply or an admin.
    const isAuthor = useCheckCorrectUserRelax(reply ? reply.author_id : "");
    
    // To toggle options menu.
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Get delete and vote reply triggers, isSuccess and error states.
    const [deleteReply, {isSuccess: deleteSuccess, error: deleteError}] = useDeleteReplyMutation();
    const [voteReply, {error: voteError}] = useVoteReplyMutation();

    // Create error alert if delete or vote reply fails.
    useErrorAlert(deleteError);
    useErrorAlert(voteError);

    // Create success alert if delete reply successful.
    useOnSuccess(deleteSuccess, "Comment deleted successfully.");

    // Use vote mutation.
    function handleVote(vote: "up" | "down") {
        if (reply.user_vote === vote) {
            voteReply({id: reply.id, vote: "none"})
        } else {
            voteReply({id: reply.id, vote: vote})
        }
    }

    return (
        <Container 
            maxWidth="sm" 
            key={reply.id}
            sx={{
                width: "108%", 
                mb: 3, 
                mt: 2
            }}
        >
            <Grid container gap={1}>
                <Grid item xs={10}>
                    <Typography component="p" sx={{wordBreak: "break-all"}}>
                        {reply.content}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
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
                            <Link to={`/replies/${reply.id}/edit`} style={{textDecoration: 'none', color: 'inherit'}}>
                                <MenuItem>Edit Reply</MenuItem>
                            </Link>

                            <MenuItem onClick={() => deleteReply(reply.id)}>Delete Reply</MenuItem>
                        </Menu>
                    </Box>}
                </Grid>
            </Grid>
            <Typography variant="caption" color="#666">
                {( reply.author ? reply.author : "[Deleted Account]" ) + 
                " • " + 
                reply.created_at.slice(0,10) + 
                (reply.updated_at !== reply.created_at ? ` ( Edited ${reply.updated_at.slice(0,10)} )` : "")}
            </Typography>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mt: 1}}>
                <ThumbUp 
                    onClick={() => handleVote("up")} 
                    sx={{
                        color: reply.user_vote === "up" ? "#1976d2": "#AAA", 
                        fontSize: "0.8em", 
                        '&:hover': {color: reply.user_vote === "up" ? "#1976d2": "#666", }
                    }}
                />
                <Typography variant="caption" color="#888">{reply.upvotes}</Typography>
                <Typography variant="caption" color="#888"> • </Typography>
                <ThumbDown 
                    onClick={() => handleVote("down")} 
                    sx={{
                        color: reply.user_vote === "down" ? "#f44336": "#AAA", 
                        fontSize: "0.8em", 
                        '&:hover': {color: reply.user_vote === "down" ? "#f44336": "#666", }
                    }}
                />
                <Typography variant="caption" color="#888">{reply.downvotes}</Typography>
            </Box>
        </Container>
    )
}