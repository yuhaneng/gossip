import { useEffect, useState } from 'react';
import { useGetRepliesByCommentQuery } from './repliesApi';
import { useAppDispatch } from '../../app/hooks';
import { createAlert, getErrorMessage } from '../alert/alertSlice';
import ReplyPreview from './ReplyPreview';
import { 
    Container,
    Box,
    Divider
 } from '@mui/material';

export default function Replies(props: {commentId: string}) {
    const [page, setPage] = useState(1);
    const { data: replies, isLoading, error } = useGetRepliesByCommentQuery({
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

    return (
        <Container maxWidth="sm" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}
        >
            { replies && (<Box sx={{width: '100%'}}>
                { replies.map((reply) => (
                    <Box sx={{mt: 3}}>
                        <Divider variant="middle" sx={{mb: 3}}/>
                        <ReplyPreview reply={reply}></ReplyPreview>
                    </Box>
                ))}
            </Box>)}
        </Container>
    )
}