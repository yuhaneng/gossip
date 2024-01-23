import { useGetPostsByUserQuery } from '../posts/postsApi';
import { useEffect, useState } from 'react';
import { useCheckSignedIn, useErrorAlert, useScroll } from '../../app/hooks';
import PostPreview from '../posts/PostPreview';
import {
    Container,
    Box,
    Button,
    Typography
} from '@mui/material'
import { useParams } from 'react-router-dom';
import { useGetProfileQuery } from '../users/usersApi';

export default function UserPosts() {
    // Get user id from page's path.
    const {id = ""} = useParams();

    // To handle pagination.
    const [page, setPage] = useState(1);

    // To handle sorting.
    const [sortBy, setSortBy] = useState<"time" | "rating">("time");

    // Get profile by user id.
    const {data: profile, error: profileError} = useGetProfileQuery(id);

    // Get posts by user id, paginated and sorted.
    const {data: posts, error: postsError} = useGetPostsByUserQuery({
        page: page,
        sortBy: sortBy,
        user: id
    })

    // Is the page scrolled to the bottom.
    const atBottom = useScroll();

    // Create error alert if get posts fails.
    useErrorAlert(postsError);

    // Increase page when scrolled to the bottom.
    useEffect(() => {
        if (atBottom) {
            setPage(page + 1);
        }
    }, [atBottom])

    // Change sort by and set page to 1.
    function handleSort(sort: "time" | "rating") {
        setSortBy(sort);
        setPage(1);
    }

    return (
        <Container maxWidth="sm">
            {( <Box component="form" noValidate sx={{ 
                    mt: 12,
					mb: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'}}
                >
                    <Typography variant="h4" sx={{fontWeight: 800, mt: 3}}>
                        {profile ? profile.username + "'s Posts" : "Posts"}
                    </Typography>
                    <Box sx={{mt: 2}}>
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
                    <Box sx={{mt: 4, width: '100%'}}>
                        {posts ? posts.map((post) => <PostPreview post={post}/>) : "" }
                    </Box>
                </Box>)}
        </Container>
    )
}