import { useEffect, useState } from 'react';
import { ReplyData, useGetRepliesByCommentQuery } from './repliesApi';
import { useAppDispatch } from '../../app/hooks';
import { createAlert, getErrorMessage } from '../alert/alertSlice';
import ReplyPreview from './ReplyPreview';
import { 
    Container,
    Box,
    Divider,
    Button
 } from '@mui/material';

export default function Replies(props: {commentId: string}) {
    const [page, setPage] = useState(1);
    const [replies, setReplies] = useState<ReplyData[]>([]);
    const [isLastPage, setIsLastPage] = useState(false);
    const { data: repliesPage, isLoading, error } = useGetRepliesByCommentQuery({
        page: page,
        commentId: props.commentId
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

    useEffect(() => {
        if (repliesPage) {
            if (repliesPage.length === 0) {
                setIsLastPage(true);
            } else {
                setReplies([...replies, ...repliesPage])
            }
        }
    }, [repliesPage])

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
                        disabled={isLastPage}
                        sx={{mt: 1, ml: -3, fontSize: '0.75em'}}
                    >
                        Show More Replies
                    </Button>
                </Box>
            )}
        </Container>
    )
}