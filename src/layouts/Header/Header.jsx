import React, { useState } from 'react';
import logo from '../../assets/images/logo.png'
import { Link } from 'react-router-dom';
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
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart,
  Notifications,
  AccountCircle
} from '@mui/icons-material';

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

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  return (
    <AppBar position="relative" color="inherit">
      <Toolbar sx={{ margin: '0 10%', display: 'flex', justifyContent: 'space-between' }}>
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

          <IconButton color="inherit" component={Link} to="/login" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AccountCircle />
            <Typography variant="caption">Tài khoản</Typography>
          </IconButton>
        </Box>
      </Toolbar>

    </AppBar>
  );
};

export default Header;