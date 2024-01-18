import { useEditCommentMutation, useGetCommentQuery } from './commentsApi';
import { useAppDispatch, useCheckCorrectUserStrict, useCheckSignedIn } from '../../app/hooks';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createAlert, getErrorMessage } from '../alert/alertSlice';
import {
    Container,
    Box,
    Button,
    Typography,
    TextField
} from '@mui/material';

export default function EditComment() {
    const {id = "0"} = useParams();
    const {data: oldComment, isLoading: commentLoading, error: commentError} = useGetCommentQuery(id)
    useCheckSignedIn();
    useCheckCorrectUserStrict(oldComment ? oldComment.author : "");

    const [edit, {isSuccess: editSuccess, isLoading: editLoading, error: editError}] = useEditCommentMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [content, setContent] = useState("")
    const [contentError, setContentError] = useState(false);

    useEffect(() => {
        if (commentError) {
            dispatch(createAlert({
                severity: "error",
                alert: getErrorMessage(commentError)
            }));
        } 

        if (oldComment) {
            setContent(oldComment.content);
        }

        if (editError) {
            dispatch(createAlert({
                severity: "error",
                alert: getErrorMessage(editError)
            }));
        }

        if (editSuccess) {
            dispatch(createAlert({
                severity : "success",
                alert: "Comment created successfully."
            }));
            navigate(oldComment ? `/posts/${oldComment.post_id}` : '/posts');
        }
    }, [commentError, oldComment, editError, editSuccess])

    function handleInput(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setContent(event.target.value);
        setContentError(false);
    }

    function validateInput() {
        let isValid = false;
        let error = "";
        if (content.length === 0) {
            setContentError(true);
            error = "Content is required."
        } else if (content.length > 255) {
            setContentError(true);
            error = "Content too long. Maximum 255 characters."
        } else {
            isValid = true;
        }
        return {isValid, error};
    }

    function handleEdit() {
        const {isValid, error} = validateInput();
        if (isValid) {
            edit({
                id: id,
                content: content,
            });
        } else {
			dispatch(createAlert({
				severity: "error",
				alert: error
			}));
        }
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                mt: 8,
                mb: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Edit Comment
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1, width: "80%"}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="content"
                        label="Content"
                        name="content"
                        InputLabelProps={{
                            shrink: true,
                          }}
                        multiline
                        rows={8}
                        value={content}
                        onChange={handleInput}
                        error={contentError}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={handleEdit}
                    >
                        Edit Comment
                    </Button>
                    <Link to={oldComment ? `/posts/${oldComment.post_id}` : '/posts'}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: '#BBB', '&:hover': { bgcolor: '#888'} }}
                        >
                            Cancel
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Container>
    )
}