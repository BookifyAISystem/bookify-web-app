import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo1.png'
import './Header.css'
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Badge,
  Box,
  styled,
  alpha,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ButtonBase,
  Popper,
  Paper,
  ClickAwayListener,
  Stack,
  Grid,
  CardContent,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart,
  Notifications,
  AccountCircle
} from '@mui/icons-material';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import ProfileTab from '../AdminLayout/navbar/ProfileTab';
import SettingTab from '../AdminLayout/navbar/SettingTab';

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'black',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'black',
  border: '1px solid #dcdcdc',
  borderRadius: theme.shape.borderRadius,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',  
    [theme.breakpoints.up('md')]: {
      width: '90ch',
    },
  },
}));


const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    alert('Đăng xuất thành công!');
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo'));
    if (token) {
      setUser({
        name: token["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        email: token["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        role: token["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        avatar: null,
      });
    }
  }, []);
  

  return (
    <AppBar position="relative" color="inherit">
      <Toolbar sx={{ margin: '0 5%', display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ height: 40, marginRight: 10 }}
          />
        </Box>

        {/* Search Bar */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}> 
          <Search sx={{ width: '50%' }}> {/* Đặt width để giới hạn độ dài */}
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </Search>
        </Box>

        {/* Icons */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <IconButton color="inherit" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Badge badgeContent={0} color="error">
              <Notifications />
            </Badge>
            <Typography variant="caption">Thông báo</Typography>
          </IconButton>

          <IconButton color="inherit" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Badge badgeContent={0} color="error">
              <ShoppingCart />
            </Badge>
            <Typography variant="caption">Giỏ hàng</Typography>
          </IconButton>

          {user ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {user && (
              <ButtonBase ref={anchorRef} onClick={handleToggle} sx={{ borderRadius: 1 }}>
                <Stack direction='row' spacing={1.25} alignItems='center' sx={{ p: 0.5 }}>
                  <Avatar alt='' src={user.avatar} />
                  <Typography variant='subtitle1'>{user.name}</Typography>
                </Stack>
              </ButtonBase>
            )}
            <Popper open={open} anchorEl={anchorRef.current} transition disablePortal placement="bottom-start">
              {({ TransitionProps }) => (
                <ClickAwayListener onClickAway={handleClose}>
                  <Paper sx={{ width: 290 }}>
                    <CardContent>
                      <Grid container justifyContent='space-between' alignItems='center'>
                          <Stack direction='row' spacing={1.25} alignItems='center'>
                            <Avatar alt='' src={user?.avatar} />
                            <Stack>
                              <Typography variant='h6'>{user?.name}</Typography>
                              <Typography variant='body2' color='text.secondary'>{user?.role}</Typography>
                            </Stack>
                            <IconButton onClick={handleLogout} size='medium'>
                              <LogoutOutlined />
                            </IconButton>
                          </Stack>
                          
                      </Grid>
                    </CardContent>
                    <Tabs variant='fullWidth' value={value} onChange={handleChange}>
                      <Tab icon={<UserOutlined />} label='Profile' />
                      <Tab icon={<SettingOutlined />} label='Settings' />
                    </Tabs>
                    {value === 0 && <ProfileTab />}
                    {value === 1 && <SettingTab />}
                  </Paper>
                </ClickAwayListener>
              )}
            </Popper>
          </Box>
          ) : (
            <IconButton color="inherit" component={Link} to="/login" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <AccountCircle />
              <Typography variant="caption">Tài khoản</Typography>
            </IconButton>
          )}

        </Box>
      </Toolbar>

    </AppBar>
  );
};

export default Header;