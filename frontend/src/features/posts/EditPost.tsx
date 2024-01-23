import { Link, useParams } from 'react-router-dom';
import { useGetPostQuery, useEditPostMutation } from "./postsApi";
import { useAppDispatch, useCheckCorrectUserStrict, useCheckSignedIn, useErrorAlert, useFormHandler, useOnSuccess } from '../../app/hooks';
import { createAlert } from '../alert/alertSlice';
import Tag from './Tag'
import {
    Container,
    Box,
    Button,
    Typography,
    TextField
} from '@mui/material';
import { validatePostContent, validateTag, validateTitle } from '../../app/validations';

export default function EditPost() {
    // Redirect user to sign in page if not signed in.
    useCheckSignedIn();

    const dispatch = useAppDispatch();

    // Get post id from page's path.
    const { id = "0" } = useParams();

    // Get post by id.
    const { data: oldPost, error: postError } = useGetPostQuery(id)

    // Redirect user to posts page if not author of post and not admin.
    useCheckCorrectUserStrict(oldPost ? oldPost.author_id : "");
    
    // Get edit post trigger, isSuccess and error states.
    const [edit, {isSuccess: editSuccess, error: editError}] = useEditPostMutation();

    // Create error alerts if get post or edit post fails.
    useErrorAlert(postError);
    useErrorAlert(editError);

    // Create success alert and redirect to post page if edit post successful.
    useOnSuccess(editSuccess, "Post edited successfully.", `/posts/${id}`);

    // To handle form data and errors.
    interface FormData {
        title: string,
        content: string,
        tag: string,
        tags: string[]
    }
    const {formData, formError, handleInput, handleError} = useFormHandler<FormData>({
        title: "",
        content: "",
        tag: "",
        tags: []
    }, oldPost)

    // Validate tag and create error alert or add tag to tags and reset tag field.
    function handleAddTag(){
        const tagError = validateTag(formData.tag, formData.tags);
        if (!tagError) {
            handleInput({tag: "", tags: formData.tags.concat(formData.tag.toLowerCase())});
        } else {
            handleError({tag: true});
			dispatch(createAlert({
				severity: "error",
				alert: tagError
			}));
        }
    }

    // Remove tag from tags.
    function deleteTag(removeTag: string) {
        handleInput({tags:formData.tags.filter((tag) => tag !== removeTag)})
    }

    // Validate form data and create error alert or use edit post mutation.
    function handleEdit() {
        const titleError = validateTitle(formData.title);
        const contentError = validatePostContent(formData.content);
        if (titleError) {
            dispatch(createAlert({
				severity: "error",
				alert: titleError
			}));
        } else if (contentError) {
            dispatch(createAlert({
				severity: "error",
				alert: contentError
			}));
        } else {
            edit({
                id: id,
                title: formData.title,
                content: formData.content,
                tags: formData.tags
            });
        }
        handleError({title: !!titleError, content: !!contentError});
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
                    Edit Post
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1, width: "80%"}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Title"
                        name="title"
                        InputLabelProps={{
                            shrink: true,
                          }}
                        autoFocus
                        value={formData.title}
                        onChange={(e) => handleInput({title: e.target.value})}
                        error={formError.title}
                    />
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
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2}}>
                        <TextField
                            margin="normal"
                            id="tag"
                            label="Tag"
                            name="tag"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{ maxLength: 12 }}
                            value={formData.tag}
                            onChange={(e) => handleInput({tag: e.target.value})}
                            error={formError.tag}
                            sx={{flexGrow: 1}}
                        />
                        <Button 
                            variant="outlined" 
                            size="small" 
                            sx={{height: 55, mt: 1}}
                            onClick={handleAddTag}
                            disabled={formData.tags.length >= 10}
                        >
                            Add Tag
                        </Button>
                    </Box>
                    <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap'}}>
                        {formData.tags.map((tag) => (
                            <Box onClick={() => deleteTag(tag)}>
                                <Tag tag={tag} />
                            </Box>
                        ))}
                    </Box>
                    <Button
						fullWidth
						variant="contained"
						sx={{ mt: 3 }}
						onClick={handleEdit}
					>
						Edit Post
					</Button>
                    <Link to={`/posts/${id}`}>
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