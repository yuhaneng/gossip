import { useEditCommentMutation, useGetCommentQuery } from './commentsApi';
import { useAppDispatch, useCheckCorrectUserStrict, useCheckSignedIn, useErrorAlert, useFormHandler, useOnSuccess } from '../../app/hooks';
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

export default function EditComment() {
    // Redirect user to sign in page if not signed in.
    useCheckSignedIn();

    const dispatch = useAppDispatch();

    // Get comment id from the page's path.
    const {id = "0"} = useParams();

    // Get comment by id.
    const {data: oldComment, error: commentError} = useGetCommentQuery(id)
    
    // Redirect user to posts page if not author of comment and not admin.
    useCheckCorrectUserStrict(oldComment ? oldComment.author_id : "");

    // Get edit comment trigger, isSuccess and error states.
    const [edit, {isSuccess: editSuccess, error: editError}] = useEditCommentMutation();

    // To handle form data and errors.
    interface FormData {
        content: string
    }
    const {formData, formError, handleInput, handleError} = useFormHandler<FormData>({
        content: ""
    }, oldComment)

    // Create error alert if get comment or edit comment fails.
    useErrorAlert(commentError);
    useErrorAlert(editError);

    // Create success alert and redirect to post page if edit comment successful.
    useOnSuccess(editSuccess, "Comment edited successfully.", oldComment ? `/posts/${oldComment.post_id}` : '/posts');

    // Validate form data and create error alert or use edit comment mutation.
    function handleEdit() {
        const contentError = validateContent(formData.content);
        if (!contentError) {
            edit({
                id: id,
                postId: oldComment ? oldComment.post_id : "0",
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
                        value={formData.content}
                        onChange={(e) => handleInput({content: e.target.value})}
                        error={formError.content}
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