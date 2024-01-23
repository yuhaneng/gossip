import { useCreatePostMutation } from "./postsApi";
import { Link } from "react-router-dom";
import { createAlert } from '../alert/alertSlice';
import { useAppDispatch, useCheckSignedIn, useErrorAlert, useFormHandler, useOnSuccess } from '../../app/hooks';
import Tag from './Tag'
import { validatePostContent, validateTag, validateTitle } from "../../app/validations";
import {
    Container,
    Box,
    Button,
    Typography,
    TextField
} from '@mui/material';

export default function CreatePost() {
    // Redirect user to sign in page if not signed in.
    useCheckSignedIn();

    const dispatch = useAppDispatch();

    // Get create comment trigger, isSuccess and error states.
    const [create, {isSuccess, error}] = useCreatePostMutation();

    // Create error alert if create post fails.
    useErrorAlert(error);

    // Create success alert and redirect to posts page if create post successful.
    useOnSuccess(isSuccess, "Post created successfully.", `/posts`);

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
    });

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

    // Validate form data and create error alert or use create post mutation.
    function handleCreate() {
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
            create({
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
                    Create Post
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
                            inputProps={{ maxLength: 10 }}
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
						onClick={handleCreate}
					>
						Create Post
					</Button>
                    <Link to="/posts">
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