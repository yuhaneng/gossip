import { Link } from 'react-router-dom';
import { PostData } from './postsApi';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

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
                    width: "100vw", 
                    mb: 3, 
                    '&:hover': {bgcolor: "#F0F0F0"}, 
                    borderRadius: 2, 
                    p: 2,
                    border: '1px solid #CCC'
                }}
            >
                <Typography variant="h3" component="h2" sx={{fontSize: '1.5em', fontWeight: 800}}>
                    {post.title}
                </Typography>
                <Typography component="p" height={50} noWrap >
                    {post.content}
                </Typography>
                <Typography variant="caption" color="#666">
                    {post.author ? post.author : "[Deleted Account]" + 
                    " • " + 
                    post.created_at.slice(0,10) + 
                    (post.updated_at !== post.created_at ? ` ( Edited ${post.updated_at.slice(0,10)} )` : "")}
                </Typography>
                <Typography variant="caption" color="#888" component="p">
                        {post.tags.map((tag) => `#${tag}   `)}
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <ThumbUpIcon sx={{color: "#AAA", fontSize: "0.8em"}}/>
                    <Typography variant="caption" color="#888">{post.upvotes}</Typography>
                    <Typography variant="caption" color="#888"> • </Typography>
                    <ThumbDownIcon sx={{color: "#AAA", fontSize: "0.8em"}}/>
                    <Typography variant="caption" color="#888">{post.downvotes}</Typography>
                </Box>
            </Container>
        </Link>
    )
}