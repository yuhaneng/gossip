import {
    Box,
    Button
} from '@mui/material';

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
                    backgroundColor: "error.dark",
                    color: 'black',
                }}}
            >
                {'#' + props.tag}
            </Button>
        </Box>
    )
}