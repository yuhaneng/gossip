import { useGetCommentsByPostQuery } from './commentsApi';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useErrorAlert, useScroll } from '../../app/hooks';
import CommentPreview from './CommentPreview';
import { 
    Container,
    Box,
    Typography,
    Button
 } from '@mui/material';

export default function Comments(props: {postId: string}) {
    // To handle pagination.
    const [page, setPage] = useState(1);

    // To handle sorting.
    const [sortBy, setSortBy] = useState<"time" | "rating">("time");

    // Is the page scrolled to the bottom.
    const atBottom = useScroll();

    // Get comments by post, paginated and sorted.
    const { data: comments, error } = useGetCommentsByPostQuery({
        page: page,
        sortBy: sortBy,
        postId: props.postId
    });

    // Create error alert if get comments fails.
    useErrorAlert(error);

    // Increase page when scrolled to bottom.
    useEffect(() => {
        if (atBottom) {
            setPage(page + 1);
        }
    }, [atBottom])

    // Change sort by and set page to one.
    function handleSort(sort: "time" | "rating") {
        setSortBy(sort);
        setPage(1);
    }

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <Box sx={{
                    mt: 5, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    width: '100%'}}
                >
                    <Typography variant="h5" sx={{fontWeight: 800}}>
                        Comments
                    </Typography>
                    <Link to={`/comments/create/${props.postId}`}>
                        <Button variant="outlined" size="small">Create Comment</Button>
                    </Link>
                </Box>
                <Box sx={{mt: 1, mb: 3, width: '100%'}}>
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
                { comments && (<Box sx={{width: '100%'}}>
                    { comments.map((comment) => (
                        <Box>
                            <CommentPreview comment={comment}></CommentPreview>
                        </Box>
                    ))}
                </Box>)}
            </Box>
        </Container>
    )
}