import { useCreateCommentMutation } from './commentsApi';
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

export default function CreateComment() {
    // Redirect user to sign in page if not signed in.
    useCheckSignedIn();

    const dispatch = useAppDispatch();

    // Get postId of the post the comment is under using the page's path.
    const {postId = "0"} = useParams();

    // Get create comment trigger, isSuccess and error states.
    const [create, {isSuccess, error}] = useCreateCommentMutation();

    // To handle form data and errors.
    interface FormData {
        content: string
    }
    const {formData, formError, handleInput, handleError} = useFormHandler<FormData>({
        content: ""
    })

    // Create error alert if create comment fails.
    useErrorAlert(error);

    // Create success alert and redirect to new post page if create comment successful.
    useOnSuccess(isSuccess, "Comment created successfully.", `/posts/${postId}`);

    // Validate form data and create error alert or use create comment mutation.
    function handleCreate() {
        const contentError = validateContent(formData.content);
        if (!contentError) {
            create({
                postId: postId,
                content: formData.content,
            });
        } else {
            handleError({content: true});
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
                    Create Comment
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
                        Create Comment
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