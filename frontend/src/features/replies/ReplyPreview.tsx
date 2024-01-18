import { useEffect, useState } from "react";
import { useAppDispatch, useCheckCorrectUserRelax } from "../../app/hooks";
import { ReplyData, useDeleteReplyMutation, useVoteReplyMutation } from "./repliesApi";
import { useNavigate } from "react-router-dom";
import { createAlert, getErrorMessage } from "../alert/alertSlice";
import { Link } from "react-router-dom";
import { 
    Container,
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem
 } from '@mui/material';
 import {
    ThumbUp,
    ThumbDown,
    MoreVert
} from '@mui/icons-material'

export default function ReplyPreview(props: {reply: ReplyData}) {
    const reply = props.reply;
    const isAuthor = useCheckCorrectUserRelax(reply ? reply.author : "");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [deleteReply, {isSuccess: deleteSuccess, isLoading: deleteLoading, error: deleteError}] = useDeleteReplyMutation();
    const [voteReply, {isSuccess: voteSuccess, isLoading: voteLoading, error: voteError}] = useVoteReplyMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (deleteSuccess) {
            dispatch(createAlert({
                severity : "success",
                alert: "Comment deleted successfully."
            }));
            navigate(0)
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
    }, [deleteSuccess, deleteError, voteError])

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 2 }}>
                <Typography component="p" >
                    {reply.content}
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
                        <Link to={`/replies/${reply.id}/edit`} style={{textDecoration: 'none', color: 'inherit'}}>
                            <MenuItem>Edit Reply</MenuItem>
                        </Link>

                        <MenuItem onClick={() => deleteReply(reply.id)}>Delete Reply</MenuItem>
                    </Menu>
                </Box>}
            </Box>
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