import { useEditReplyMutation, useGetReplyQuery } from './repliesApi';
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
    useCheckSignedIn();
    const dispatch = useAppDispatch();
    const {id = "0"} = useParams();
    const {data: oldReply, error: replyError} = useGetReplyQuery(id)
    useCheckCorrectUserStrict(oldReply ? oldReply.author : "");

    const [edit, {isSuccess: editSuccess, error: editError}] = useEditReplyMutation();

    interface FormData {
        content: string
    }
    const {formData, formError, handleInput, handleError} = useFormHandler<FormData>({
        content: ""
    }, oldReply)

    useErrorAlert(replyError);
    useErrorAlert(editError);
    useOnSuccess(editSuccess, "Reply created successfully.", oldReply ? `/posts/${oldReply.post_id}` : '/posts');

    function handleEdit() {
        const contentError = validateContent(formData.content);
        if (!contentError) {
            edit({
                id: id,
                commentId: oldReply ? oldReply.comment_id : "0",
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
                    Edit Reply
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
                        Edit Reply
                    </Button>
                    <Link to={oldReply ? `/posts/${oldReply.comment_id}` : '/posts'}>
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