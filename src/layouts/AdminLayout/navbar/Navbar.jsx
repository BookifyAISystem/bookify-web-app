import React, { useEffect} from 'react' 
import { useState, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';
// import avatar1 from '../../../assets/images/avatar.png';
// import avatar1 from '../../../../public/noavatar.png';
import logo from '../../../assets/images/logo1.png';
import './Navbar.scss';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const theme = useTheme();  
  const [user, setUser] = useState(null);
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

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
    <div className='navbaradmin'>
      <div className='logo'>
        <Link to='/admin'>
          <img src={logo} alt='logo' />
        </Link>
        
      </div>
      <div className='icons'>
        <img src='/search.svg' alt='' className='icon' />
        <img src='/app.svg' alt='' className='icon' />
        <img src='/expand.svg' alt='' className='icon' />
        <div className='notification'>
          <img src='/notifications.svg' alt='' className='icon' />
          <span>1</span>
        </div>
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
          <ButtonBase ref={anchorRef} onClick={handleToggle} sx={{ borderRadius: 1 }}>
            <Stack direction='row' spacing={1.25} alignItems='center' sx={{ p: 0.5 }}>
              <Avatar alt='' src='./noavatar.png' className='avatar' size='sm' />
              <Typography variant='subtitle1'>Admin</Typography>
            </Stack>
          </ButtonBase>
          <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal placement="bottom-start"
          modifiers={[
            {
              name: 'preventOverflow',
              options: {
                boundary: 'window',
              },
            },
            {
              name: 'offset',
              options: {
                offset: [0, 8], // Điều chỉnh khoảng cách xuống dưới
              },
            },
          ]}>
            {({ TransitionProps }) => (
              <ClickAwayListener onClickAway={handleClose}>
                <Paper sx={{ width: 290 }}>
                  <CardContent>
                    <Grid container justifyContent='space-between' alignItems='center'>
                      <Grid item>
                        <Stack direction='row' spacing={1.25} alignItems='center'>
                          <Avatar alt='' src='./noavatar.png' className='avatar' />
                          <Stack>
                            <Typography variant='h6'>{user.name}</Typography>
                            <Typography variant='body2' color='text.secondary'>{user.role}</Typography>
                          </Stack>
                          <IconButton size='large'>
                            <LogoutOutlined />
                          </IconButton>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs variant='fullWidth' value={value} onChange={handleChange}>
                      <Tab icon={<UserOutlined />} label='Profile' />
                      <Tab icon={<SettingOutlined />} label='Settings' />
                    </Tabs>
                  </Box>
                  {value === 0 && <ProfileTab />}
                  {value === 1 && <SettingTab />}
                </Paper>
              </ClickAwayListener>
            )}
          </Popper>
        </Box>
        <img src='/setting.svg' alt='' className='icon' />
      </div>
    </div>
  );
};

export default Navbar;
