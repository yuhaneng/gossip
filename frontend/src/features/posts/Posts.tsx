import { useEffect, useState } from "react";
import { useGetPostsByTagsQuery, PostData } from "./postsApi";
import { useAppDispatch } from "../../app/hooks";
import { createAlert } from "../alert/alertSlice";
import { getErrorMessage } from '../../features/alert/alertSlice';
import Tag from "./Tag";
import PostPreview from './PostPreview';
import {
    Container,
    Box,
    Button,
    TextField,
    InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';

export default function Posts() {
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<"time" | "rating">("time");
    const [tags, setTags] = useState<string[]>([]);
    const {data: postsPage, isLoading, error } = useGetPostsByTagsQuery({
        page: page,
        sortBy: sortBy,
        tags: tags
    });
    const [posts, setPosts] = useState<PostData[]>([])
    const [searchbar, setSearchbar] = useState("");
    const dispatch = useAppDispatch();
    const [test, setTest] = useState(false);

    useEffect(() => {
        if (error) {
            dispatch(createAlert({
                severity: "error",
                alert: getErrorMessage(error)
            }));
        }
    }, [error])

    useEffect(() => {
        if (postsPage) {
            setPosts([...posts, ...postsPage])
        }
    }, [postsPage])

    useEffect(() => {
        const handleScroll = () => {
            const offsetHeight = document.documentElement.offsetHeight;
            const innerHeight = window.innerHeight;
            const scrollTop = document.documentElement.scrollTop;
        
            const hasReachedBottom = offsetHeight - (innerHeight + scrollTop) <= 10;
        
            if (hasReachedBottom) {
                setPage(page + 1);
            }
        };
      
        window.addEventListener("scroll", handleScroll);
      
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                mt: 4,
                mb: 16,
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
                                <Search />
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
                <Box sx={{mt: 2, width: '100%'}}>
                    {posts ? posts.map((post : PostData) => <PostPreview post={post} />) : "No posts found."}
                </Box>
            </Box>
        </Container>
    );
}