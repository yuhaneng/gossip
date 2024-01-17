import { useEffect, useState } from "react";
import { useGetPostsByTagsQuery, PostData } from "./postsApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createAlert, createAlertData } from "../alert/alertSlice";
import { getErrorMessage } from '../../features/alert/alertSlice';
import Tag from "./Tag";
import PostPreview from './PostPreview';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

export default function Posts() {
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<"time" | "rating">("time");
    const [tags, setTags] = useState<string[]>([]);
    const {data: posts, isLoading, error } = useGetPostsByTagsQuery({
        page: page,
        sortBy: sortBy,
        tags: tags
    });
    const [searchbar, setSearchbar] = useState("");
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (error) {
            const alertData: createAlertData = {
                severity: "error",
                alert: getErrorMessage(error)
            }
            dispatch(createAlert(alertData));
        }
    }, [error])

    function handleAddTag() {
        setTags(tags.concat(searchbar));
        setSearchbar("");
    }

    function handleDeleteTag(removeTag: string) {
        setTags(tags.filter((tag) => tag !== removeTag));
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                marginTop: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <TextField
                    margin="normal"
                    placeholder="Search by tags..."
                    sx={{width: '75%', maxWidth: '40ch'}}
                    value={searchbar}
                    onChange={(e) => setSearchbar(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button variant="text" onClick={handleAddTag}>
                                    Add Tag
                                </Button>
                            </InputAdornment>
                        )
                    }}
                />
                <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                        {tags.map((tag) => (
                            <Box onClick={() => handleDeleteTag(tag)}>
                                <Tag tag={tag} />
                            </Box>
                        ))}
                    </Box>
                <Box>
                    <Button 
                        variant="text" 
                        size="small"  
                        onClick={() => setSortBy("rating")}
                        disableRipple
                        sx={{mr: 2}}
                    >
                        By Rating
                    </Button>
                    <Button 
                        variant="text" 
                        size="small"  
                        onClick={() => setSortBy("time")}
                        disableRipple
                        sx={{ml: 2}}
                    >
                        By Time
                    </Button>
                </Box>
                <Box sx={{mt: 2}}>
                    {posts ? posts.map((post : PostData) => <PostPreview post={post} />) : "No posts found."}
                </Box>
            </Box>
        </Container>
    );
}