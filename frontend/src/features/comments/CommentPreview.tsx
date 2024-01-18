import { CommentData, useDeleteCommentMutation } from "./commentsApi";
import { useAppDispatch, useCheckCorrectUserRelax } from "../../app/hooks";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { createAlert } from "../alert/alertSlice";

export default function CommentPreview(props: {comment: CommentData}) {
    const comment = props.comment;
    const isAuthor = useCheckCorrectUserRelax(comment ? comment.author : "");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [deleteComment, {isSuccess, isLoading, error}] = useDeleteCommentMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            dispatch(createAlert({
                severity : "success",
                alert: "Comment deleted successfully."
            }));
            navigate(0)
        }
    })

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Container 
            maxWidth="sm" 
            key={comment.id}
            sx={{
                width: "100%", 
                mb: 3, 
                borderRadius: 2, 
                p: 2,
                border: '1px solid #EEE'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography component="p" height={50} noWrap >
                    {comment.content}
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
                        <Link to={`/comments/${comment.id}/edit`} style={{textDecoration: 'none', color: 'inherit'}}>
                            <MenuItem>Edit Comment</MenuItem>
                        </Link>

                        <MenuItem onClick={() => deleteComment(comment.id)}>Delete Comment</MenuItem>
                    </Menu>
                    </Box>}
                </Box>
            <Typography variant="caption" color="#666">
                {( comment.author ? comment.author : "[Deleted Account]" ) + 
                " • " + 
                comment.created_at.slice(0,10) + 
                (comment.updated_at !== comment.created_at ? ` ( Edited ${comment.updated_at.slice(0,10)} )` : "")}
            </Typography>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <ThumbUp sx={{color: "#AAA", fontSize: "0.8em"}}/>
                <Typography variant="caption" color="#888">{comment.upvotes}</Typography>
                <Typography variant="caption" color="#888"> • </Typography>
                <ThumbDown sx={{color: "#AAA", fontSize: "0.8em"}}/>
                <Typography variant="caption" color="#888">{comment.downvotes}</Typography>
            </Box>
        </Container>
    )
}