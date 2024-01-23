import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectId, selectIsSignedIn, selectUsername } from '../profile/usersSlice';
import {
	AppBar,
	Box,
	Toolbar,
	IconButton,
	Typography,
	Menu,
	Container,
	Avatar,
	Tooltip,
	MenuItem,
} from '@mui/material'
import {
	Forum,
	Add
} from '@mui/icons-material'

function Topbar() {
	// To toggle user menu.
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	// Get is signed in, user id and username from store.
	const isSignedIn = useAppSelector(selectIsSignedIn);
	const id = useAppSelector(selectId);
	const username = useAppSelector(selectUsername);

	// Handle options on the user menu.
	const [userActions, setUserActions] = useState<{name: string, link: string}[]>([]);
	useEffect(() => {
		if (isSignedIn) {
			setUserActions([
				{name: 'Profile', link: `/profile/${id}`},
				{name: 'My Posts', link: `/profile/${id}/posts`},
				{name: 'Settings', link: `/profile/${id}/settings`},
				{name: 'Sign Out', link: '/users/signout'}
			]);
		} else {
			setUserActions([
				{name: 'Sign In', link: '/users/signin'}, 
				{name: 'Sign Up', link: '/users/signup'}, 
			]);
		}
	}, [isSignedIn])

  	return (
		<AppBar position="static" elevation={4}>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Link to='/posts' style={{textDecoration: 'none', color: 'inherit'}}>
						<Forum sx={{ mr: 1 }} />
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
									<Add sx={{color: '#222', width: 35, height: 35, marginTop: 0.5}}/>
								</Link>
							</Avatar>
						</IconButton>
					</Tooltip>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Profile">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0, boxShadow: 3}}>
								{username 
									? (<Avatar>{username[0].toUpperCase()}</Avatar>)
									: (<Avatar />)}
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