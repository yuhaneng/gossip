import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectIsSignedIn } from '../users/usersSlice';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ForumIcon from '@mui/icons-material/Forum';
import AddIcon from '@mui/icons-material/Add';

function Topbar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const isSignedIn = useAppSelector(selectIsSignedIn);
  const [userActions, setUserActions] = useState<{name: string, link: string}[]>([])
  
  useEffect(() => {
	if (isSignedIn) {
		setUserActions([
			{name: 'Profile', link: '/users/profile'},
    		{name: 'Sign Out', link: '/users/signout'}
		]);
	} else {
		setUserActions([
			{name: 'Sign In', link: '/users/signin'}, 
    		{name: 'Sign Up', link: '/users/signup'}, 
		]);
	}
  }, [isSignedIn])

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
		<AppBar position="static" elevation={4}>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Link to='/posts' style={{textDecoration: 'none', color: 'inherit'}}>
						<ForumIcon sx={{ mr: 1 }} />
					</Link>
					<Link to='/posts' style={{textDecoration: 'none', color: 'inherit'}}>
						<Typography
							variant="h6"
							noWrap
							sx={{
								mr: 2,
								fontFamily: 'monospace',
								fontWeight: 700,
								letterSpacing: '.3rem',
								color: 'inherit',
								textDecoration: 'none',
							}}
						>
							GOSSIP
						</Typography>
					</Link>
					<Box sx={{ flexGrow: 1 }}>
					</Box>
					<Tooltip title="Create Post">
						<IconButton sx={{ p: 0, mr: 1.5, boxShadow: 3}}>
							<Avatar sx={{backgroundColor: "#EEE"}} >
								<Link to="/posts/create" >
									<AddIcon sx={{color: '#222', width: 35, height: 35, marginTop: 0.5}}/>
								</Link>
							</Avatar>
						</IconButton>
					</Tooltip>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Profile">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0, boxShadow: 3}}>
								<Avatar />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{userActions.map((action) => (
								<MenuItem key={action.name} onClick={handleCloseUserMenu}>
									<Link to={action.link} style={{textDecoration: 'none', color: 'inherit'}}>
										<Typography 
											variant="body1"
											noWrap
											textAlign="center" 
											sx={{
													mr: 2,
													display: 'flex',
													color: 'inherit',
													textDecoration: 'none',
												}}
										>
											{action.name}
										</Typography>
									</Link>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
  );
}
export default Topbar;