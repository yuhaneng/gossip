import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function ErrorPage() {
    return (
        <Container maxWidth='xs'>
            <Box
                sx={{
                marginTop: 30,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h3" sx={{mb: 4}}>
                    Error
                </Typography>
                <Typography component="h1" variant="h5" sx={{mb: 4}}>
                    404 : Not Found
                </Typography>
                <Link to="/posts">
                    <Button
                        variant="text"
                        size="large"
                        sx={{ }}
                    >Return to Posts</Button>
                </Link>
            </Box>
        </Container>
    )
}