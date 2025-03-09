import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const handleListItemClick = (index, path) => {
    setSelectedIndex(index);
    if (path) navigate(path);
  };

  const handleViewProfile = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.AccountId) {
        navigate(`/profile/${user.AccountId}`);
      } else {
        alert("User ID not found in userInfo!");
      }
    } else {
      alert("User info not found!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    alert('Đăng xuất thành công!');
    window.location.href = '/login';
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      {/* View Profile */}
      <ListItemButton selected={selectedIndex === 0} onClick={handleViewProfile}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="View Profile" />
      </ListItemButton>

      {/* Social Profile */}
      <ListItemButton selected={selectedIndex === 1} onClick={() => handleListItemClick(1, "/apps/profiles/account/personal")}>
        <ListItemIcon>
          <ProfileOutlined />
        </ListItemIcon>
        <ListItemText primary="Social Profile" />
      </ListItemButton>

      {/* Billing */}
      <ListItemButton selected={selectedIndex === 2} onClick={() => handleListItemClick(2, "/apps/invoice/details/1")}>
        <ListItemIcon>
          <WalletOutlined />
        </ListItemIcon>
        <ListItemText primary="Billing" />
      </ListItemButton>

      {/* Logout */}
      <ListItemButton selected={selectedIndex === 3} onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
