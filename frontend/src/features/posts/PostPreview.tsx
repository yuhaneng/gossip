import { Link } from 'react-router-dom';
import { PostData } from './postsApi';
import {
    Container,
    Box,
    Typography
} from '@mui/material';
import {
    ThumbUp,
    ThumbDown
} from '@mui/icons-material'

export default function PostPreview(props: {post: PostData}) {
    const post = props.post;
    return (
        <Link 
            to={`/posts/${post.id}`} 
            style={{textDecoration: 'none', color: 'inherit'}}
        >
            <Container 
                maxWidth="sm" 
                key={post.id} 
                sx={{
                    width: "100%", 
                    mb: 3, 
                    '&:hover': {bgcolor: "#F8F8F8"}, 
                    borderRadius: 2, 
                    p: 2,
                    border: '1px solid #EEE'
                }}
            >
                <Typography variant="h3" component="h2" sx={{fontSize: '1.5em', fontWeight: 800}}>
                    {post.title}
                </Typography>
                <Typography component="p" height={50} noWrap >
                    {post.content}
                </Typography>
                <Typography variant="caption" color="#666">
                    {( post.author ? post.author : "[Deleted Account]" ) + 
                    " • " + 
                    post.created_at.slice(0,10) + 
                    (post.updated_at !== post.created_at ? ` ( Edited ${post.updated_at.slice(0,10)} )` : "")}
                </Typography>
                <Typography variant="caption" color="#888" component="p">
                        {post.tags.map((tag) => `#${tag}   `)}
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <ThumbUp sx={{color: "#AAA", fontSize: "0.8em"}}/>
                    <Typography variant="caption" color="#888">{post.upvotes}</Typography>
                    <Typography variant="caption" color="#888"> • </Typography>
                    <ThumbDown sx={{color: "#AAA", fontSize: "0.8em"}}/>
                    <Typography variant="caption" color="#888">{post.downvotes}</Typography>
                </Box>
            </Container>
        </Link>
    )
}