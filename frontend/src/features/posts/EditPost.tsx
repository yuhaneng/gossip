import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetPostQuery, useEditPostMutation } from "./postsApi";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from '../../features/alert/alertSlice';
import { useAppDispatch, useCheckCorrectUserStrict, useCheckSignedIn } from '../../app/hooks';
import { createAlert } from '../alert/alertSlice';
import Tag from './Tag'
import {
    Container,
    Box,
    Button,
    Typography,
    TextField
} from '@mui/material';

export default function EditPost() {
    const { id = "0" } = useParams();
    const { data: oldPost, isLoading: postLoading, error: postError } = useGetPostQuery(id)
    useCheckSignedIn();
    useCheckCorrectUserStrict(oldPost ? oldPost.author : "");

    const [edit, {isSuccess: editSuccess, isLoading: editLoading, error: editError}] = useEditPostMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    interface FormData {
        title: string,
        content: string,
        tag: string,
        tags: string[]
    }
    const initialFormData: FormData = {
        title: "",
        content: "",
        tag: "",
        tags: []
    }
    const [formData, setFormData] = useState(initialFormData);

    interface FormError {
        title: boolean,
        content: boolean,
        tag: boolean
    }
    const initialFormError: FormError = {
        title: false,
        content: false,
        tag: false
    }
    const [formError, setFormError] = useState(initialFormError);

    useEffect(() => {
        if (oldPost) {
            setFormData({
                title: oldPost.title,
                content: oldPost.content,
                tag: "",
                tags: oldPost.tags
            })
        }

        if (postError) {
            dispatch(createAlert({
                severity: "error",
                alert: getErrorMessage(postError)
            }));
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
                alert: "Post edited successfully."
            }));
            navigate(`/posts/${id}`);
        }
    }, [oldPost, postError, editError, editSuccess])

    function handleInput(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
        if ((name === "title" || name === "content" || name === "tag") && formError[name]) {
            handleError(name, false)
        }
    }

    function handleError(name: "title" | "content" | "tag", value: boolean) {
        setFormError({
            ...formError,
            [name]: value
        })
    }

    function validateTag() {
        let isValid = false;
        let error = "";
        if (formData.tag.length === 0) {
            handleError("tag", true);
            error = "Tag cannot be empty."
        } else if (!formData.tag.match(/^\w*$/)) {
            handleError("tag", true);
            error = "Tag cannot contain special characters."
        } else if (formData.tag.length > 10) {
            handleError("tag", true);
            error = "Tag too long. Maximum 10 characters."
        } else if (formData.tags.includes(formData.tag)) {
            handleError("tag", true);
            error = "Tag must be unique."
        } else {
            isValid = true;
        }
        return {isValid, error};
    }

    function handleAddTag(){
        const {isValid, error} = validateTag();
        if (isValid) {
            setFormData({
                ...formData,
                tags: formData.tags.concat(formData.tag.toLowerCase()),
                tag: ""
            })
        } else {
			dispatch(createAlert({
				severity: "error",
				alert: error
			}));
        }
    }

    function deleteTag(removeTag: string) {
        setFormData({
            ...formData,
            tags: formData.tags.filter((tag) => tag !== removeTag)
        })
    }

    function validateInput() {
        let isValid = false;
        let error = "";
        if (formData.title.length === 0) {
            handleError("title", true);
            error = "Title is required."
        } else if (formData.title.length > 255) {
            handleError("title", true);
            error = "Title too long. Maximum 255 characters."
        } else if (formData.content.length === 0) {
            handleError("content", true);
            error = "Content is required." 
        } else if (formData.content.length > 50000) {
            handleError("content", true);
            error = "Content too long. Maximum 50 000 characters."
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
                title: formData.title,
                content: formData.content,
                tags: formData.tags
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
                mt: 4,
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
                        onChange={handleInput}
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
                        onChange={handleInput}
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
                            onChange={handleInput}
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