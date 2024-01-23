import { CommentData, useDeleteCommentMutation, useVoteCommentMutation } from "./commentsApi";
import { useCheckCorrectUserRelax, useErrorAlert, useOnSuccess } from "../../app/hooks";
import { useState } from "react";
import { Link } from "react-router-dom";
import Replies from "../replies/Replies";
import { 
    Container,
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Button
 } from '@mui/material';
 import {
    ThumbUp,
    ThumbDown,
    MoreVert
} from '@mui/icons-material'

export default function CommentPreview(props: {comment: CommentData}) {
    const comment = props.comment;

    // Is the signed in user the author of the comment, or an admin.
    const isAuthor = useCheckCorrectUserRelax(comment ? comment.author_id : "");

    // To toggle the options menu.
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        if (anchorEl === null) {
            setAnchorEl(event.currentTarget);
        } else {
            setAnchorEl(null);
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // To toggle replies list.
    const [showReplies, setShowReplies] = useState(false);

    // Get delete and vote trigger, isSuccess and error states.
    const [deleteComment, {isSuccess: deleteSuccess, error: deleteError}] = useDeleteCommentMutation();
    const [voteComment, {error: voteError}] = useVoteCommentMutation();

    // Create error alerts if delete or vote fails.
    useErrorAlert(deleteError);
    useErrorAlert(voteError);
    // Create success alert if delete successful.
    useOnSuccess(deleteSuccess, "Comment deleted successfully.")

    // Use vote mutation.
    function handleVote(vote: "up" | "down") {
        if (comment.user_vote === vote) {
            voteComment({id: comment.id, vote: "none"})
        } else {
            voteComment({id: comment.id, vote: vote})
        }
    }

    return (
        <Container 
            maxWidth="sm" 
            key={comment.id}
            sx={{
                width: "100%", 
                mb: 3, 
                borderRadius: 2, 
                p: 2,
                border: '1px solid #EEE',
                borderColor: 'secondary.dark'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 2 }}>
                <Typography component="p" sx={{wordBreak: "break-all"}} >
                    {comment.content}
                </Typography>
                <Box>
                    <IconButton
                        size="small"
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
                        onClick={handleMenu}
                        onClose={handleClose}
                    >
                        <Link to={`/replies/create/${comment.post_id}/${comment.id}`} 
                            style={{textDecoration: 'none', color: 'inherit'}}
                        >
                            <MenuItem>Reply Comment</MenuItem>
                        </Link>
                        {isAuthor && (
                            <Box>
                                <Link to={`/comments/${comment.id}/edit`} style={{textDecoration: 'none', color: 'inherit'}}>
                                    <MenuItem>Edit Comment</MenuItem>
                                </Link>
                                <MenuItem onClick={() => deleteComment(comment.id)}>Delete Comment</MenuItem>
                            </Box>
                        )}
                    </Menu>
                </Box>
            </Box>
            <Typography variant="caption" color="#666">
                {( comment.author ? comment.author : "[Deleted Account]" ) + 
                " • " + 
                comment.created_at.slice(0,10) + 
                (comment.updated_at !== comment.created_at ? ` ( Edited ${comment.updated_at.slice(0,10)} )` : "")}
            </Typography>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mt: 1}}>
                <ThumbUp 
                    onClick={() => handleVote("up")} 
                    sx={{
                        color: comment.user_vote === "up" ? "#1976d2": "#AAA", 
                        fontSize: "0.8em", 
                        '&:hover': {color: comment.user_vote === "up" ? "#1976d2": "#666", }
                    }}
                />
                <Typography variant="caption" color="#888">{comment.upvotes}</Typography>
                <Typography variant="caption" color="#888"> • </Typography>
                <ThumbDown 
                    onClick={() => handleVote("down")} 
                    sx={{
                        color: comment.user_vote === "down" ? "#f44336": "#AAA", 
                        fontSize: "0.8em", 
                        '&:hover': {color: comment.user_vote === "down" ? "#f44336": "#666", }
                    }}
                />
                <Typography variant="caption" color="#888">{comment.downvotes}</Typography>
            </Box>
            <Button
                variant="text"
                size="small"
                onClick={() => setShowReplies(!showReplies)}
                sx={{mt: 2, fontSize: '0.75em', ml: '-5px'}}
            >
                {showReplies ? "Hide Replies" : "Show Replies"}
            </Button>
            {showReplies && (
                <Box sx={{mt: 3, display: 'flex', justifyContent: 'space-between', gap: 0}}>
                    <Replies commentId={comment.id}/>
                </Box>
            )}
        </Container>
    )
}