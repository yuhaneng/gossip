import { useState } from 'react';
import { useGetRepliesByCommentQuery } from './repliesApi';
import { useErrorAlert } from '../../app/hooks';
import ReplyPreview from './ReplyPreview';
import { 
    Container,
    Box,
    Divider,
    Button
 } from '@mui/material';

export default function Replies(props: {commentId: string}) {
    // To handle pagination.
    const [page, setPage] = useState(1);

    // Get replies by comment, paginated and sorted by time.
    const { data: replies, error } = useGetRepliesByCommentQuery({
        page: page,
        commentId: props.commentId
    });

    // Create error alert if get replies fails.
    useErrorAlert(error);

    return (
        <Container maxWidth="sm" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}
        >
            { replies && (
                <Box sx={{width: '100%'}}>
                    { replies.map((reply) => (
                        <Box sx={{mt: 3}}>
                            <Divider variant="middle" sx={{mb: 3}}/>
                            <ReplyPreview reply={reply}></ReplyPreview>
                        </Box>
                    ))}
                    <Divider variant="middle" sx={{mb: 3}}/>
                    <Button 
                        variant="text" 
                        onClick={() => setPage(page + 1)}
                        sx={{mt: 1, ml: -3, fontSize: '0.75em'}}
                    >
                        Show More Replies
                    </Button>
                </Box>
            )}
        </Container>
    )
}