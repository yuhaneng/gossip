import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { destroyAlert, selectAlert } from './alertSlice'; 
import Container from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

export default function AlertBox() {
    const dispatch = useAppDispatch();
    const {active, alert, severity} = useAppSelector(selectAlert);

    return (
        <Container sx={{
            position: 'fixed', 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            top: 25, 
            zIndex: 1
        }}>
            {active 
                ? (
                    <Alert 
                        variant="filled" 
                        severity={severity} 
                        onClose={() => {dispatch(destroyAlert())}}
                        sx={{boxShadow: 5}}
                    >
                        <Typography sx={{width: 500}}>
                            {alert}
                        </Typography>
                    </Alert>
                    ) 
                : ""
            }
        </Container>
    )
}