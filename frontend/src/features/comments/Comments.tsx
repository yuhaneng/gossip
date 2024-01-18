import { useGetCommentsByPostQuery } from './commentsApi';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createAlert, getErrorMessage } from '../alert/alertSlice';
import { useAppDispatch } from '../../app/hooks';
import CommentPreview from './CommentPreview';
import { 
    Container,
    Box,
    Typography,
    Button
 } from '@mui/material';

export default function Comments(props: {postId: string}) {
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<"time" | "rating">("time");
    const { data: comments, isLoading, error } = useGetCommentsByPostQuery({
        page: page,
        sortBy: sortBy,
        postId: props.postId
    });
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (error) {
            dispatch(createAlert({
                severity: "error",
                alert: getErrorMessage(error)
            }));
        }
    }, [error])

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
                { comments && (<Box sx={{width: '100%'}}>
                    { comments.map((comment) => <CommentPreview comment={comment}></CommentPreview>)}
                </Box>)}
            </Box>
        </Container>
    )
}