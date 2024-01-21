import { useEffect, useState } from "react";
import { useGetPostsByTagsQuery } from "./postsApi";
import { useErrorAlert, useScroll } from "../../app/hooks";
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
    const {data: posts, error } = useGetPostsByTagsQuery({
        page: page,
        sortBy: sortBy,
        tags: tags
    });
    const atBottom = useScroll();
    const [searchbar, setSearchbar] = useState("");

    useErrorAlert(error);

    useEffect(() => {
        if (atBottom) {
            setPage(page + 1);
        }
    }, [atBottom])

    function handleAddTag() {
        setTags(tags.concat(searchbar));
        setSearchbar("");
        setPage(1);
    }

    function handleDeleteTag(removeTag: string) {
        setTags(tags.filter((tag) => tag !== removeTag));
        setPage(1);
    }

    function handleSort(sort: "time" | "rating") {
        setSortBy(sort);
        setPage(1);
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
                                <Button variant="text" onClick={handleAddTag} disabled={searchbar.length === 0}>
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
                        onClick={() => handleSort("rating")}
                        disableRipple
                        sx={{mr: 2, color: sortBy === "rating" ? '#1976d2' : '#BBB'}}
                    >
                        By Rating
                    </Button>
                    <Button 
                        variant="text" 
                        size="small"  
                        onClick={() => handleSort("time")}
                        disableRipple
                        sx={{ml: 2, color: sortBy === "time" ? '#1976d2' : '#BBB'}}
                    >
                        By Time
                    </Button>
                </Box>
                <Box sx={{mt: 2, width: '100%'}}>
                    {posts ? posts.map((post) => <PostPreview post={post} />) : "" }
                </Box>
            </Box>
        </Container>
    );
}