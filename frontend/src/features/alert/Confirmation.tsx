import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText    
} from '@mui/material';

interface Props {
    title: string,
    content: string,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    action: () => void
}

export default function Confirmation(props: Props) {
    return (
        <Dialog
            open={props.open}
            onClose={() => props.setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
             <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {props.content}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => props.setOpen(false)} color="primary">
                Cancel
            </Button>
            <Button onClick={() => {props.setOpen(false); props.action();}} color="warning" autoFocus>
                Confirm
            </Button>
            </DialogActions>
        </Dialog>

    )
}