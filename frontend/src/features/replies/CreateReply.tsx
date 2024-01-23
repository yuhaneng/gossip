import { useCreateReplyMutation } from './repliesApi';
import { useAppDispatch, useCheckSignedIn, useErrorAlert, useFormHandler, useOnSuccess } from '../../app/hooks';
import { Link, useParams } from 'react-router-dom';
import { createAlert } from '../alert/alertSlice';
import { validateContent } from '../../app/validations';
import {
    Container,
    Box,
    Button,
    Typography,
    TextField
} from '@mui/material';

export default function CreateReply() {
    // Redirect user to sign in page if not signed in.
    useCheckSignedIn();

    const dispatch = useAppDispatch();

    // Get post id and comment id from page's path.
    const {postId = "0", commentId = "0"} = useParams();

    // Get create reply trigger, isSuccess and error states.
    const [create, {isSuccess, error}] = useCreateReplyMutation();

    // Handle form data and errors.
    interface FormData {
        content: string
    }
    const {formData, formError, handleInput, handleError} = useFormHandler<FormData>({
        content: ""
    })

    // Create error alert if create reply fails.
    useErrorAlert(error);

    // Create success alert and redirect to post page if create reply successful.
    useOnSuccess(isSuccess, "Reply created successfully.", `/posts/${postId}`);

    // Validate form data and create error alert or use create reply mutation.
    function handleCreate() {
        const contentError = validateContent(formData.content);
        if (!contentError) {
            create({
                commentId: commentId,
                content: formData.content,
            });
        } else {
            handleError({content: true})
			dispatch(createAlert({
				severity: "error",
				alert: contentError
			}));
        }
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                mt: 12,
                mb: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Create Reply
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
                        value={formData.content}
                        onChange={(e) => handleInput({content: e.target.value})}
                        error={formError.content}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={handleCreate}
                    >
                        Create Reply
                    </Button>
                    <Link to={`/posts/${postId}`}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark'} }}
                        >
                            Cancel
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Container>
    )
}