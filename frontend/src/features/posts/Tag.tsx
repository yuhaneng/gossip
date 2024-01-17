import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function Tag(props: {tag: string}) {
    return (
        <Box>
            <Button variant="outlined" sx={{
                fontSize: '0.8em', 
                color: '#BBB',
                borderColor: '#BBB',
                borderRadius: 3,
                minWidth: 0,
                p: '0 1em', 
                textTransform: 'none',
                '&:hover': {
                    borderColor: "#B44", 
                    backgroundColor: "#EBB",
                    color: 'black',
                }}}
            >
                {'#' + props.tag}
            </Button>
        </Box>
    )
}