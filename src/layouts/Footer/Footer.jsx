import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, Typography, Grid } from '@mui/material';
import logo from '../../assets/images/logo1.png';
import './Footer.css';
import { fontWeight } from '@mui/system';

const Footer = () => {
  const navigate = useNavigate();

  const handleAccountClick = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      navigate(`/profile/${user.AccountId}`);
    } else {
      navigate('/login'); // Chuyển hướng tới trang login nếu chưa đăng nhập
    }
  };

  const handleSupportClick = () => {
    navigate('/support');
  };

  const handleServiceClick = () => {
    navigate('/service');
  };

  return (
    <Box className="footer">
      <Grid container className="footer-content" justifyContent="space-between">
        <Grid item xs={12} sm={6} md={2.5} className="footer-section">
          <Box className="logo">
            <img src={logo} alt="Logo" />
          </Box>
          <Typography variant="body2" className="footer-section-1">Lầu 5, 387-389 Hai Bà Trưng, Quận 3, TP HCM</Typography>
          <Typography variant="body2" className="footer-section-1">Công Ty Cổ Phần Phát Hành Sách TP HCM - BOOKIFY</Typography>
          <Typography variant="body2" className="footer-section-2">60 - 62 Lê Lợi, Quận 1, TP. HCM, Việt Nam</Typography>
          <Typography variant="body2" className="footer-section-1">Bookify.com nhận đặt hàng trực tuyến và giao hàng tận nơi.</Typography>
          <Typography variant="body2" className="footer-section-2">KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng cũng như tất cả Hệ Thống Bookify trên toàn quốc.</Typography>
        </Grid>

        <Divider orientation="vertical" flexItem />
        
        <Grid item xs={12} sm={6} md={2.5} className="footer-section">
          <Typography variant="h6" sx={linkStyle} onClick={handleServiceClick}>DỊCH VỤ</Typography>
          <Typography variant="body2" sx={linkStyle} onClick={handleServiceClick}>Điều khoản sử dụng</Typography>
          <Typography variant="body2" sx={linkStyle} onClick={handleServiceClick}>Chính sách bảo mật thông tin cá nhân</Typography>
          <Typography variant="body2" sx={linkStyle} onClick={handleServiceClick}>Chính sách bảo mật thanh toán</Typography>
          <Typography variant="body2" sx={linkStyle} onClick={handleServiceClick}>Giới thiệu Bookify</Typography>
          <Typography variant="h6" sx={{ marginBottom: '5px' }}>LIÊN HỆ</Typography>
          <Typography variant="body2">📍 60-62 Lê Lợi, Q.1, TP. HCM</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={2.5} className="footer-section">
          <Typography variant="h6" sx={linkStyle} onClick={handleSupportClick}>HỖ TRỢ</Typography>
          <Typography variant="body2" sx={linkStyle} onClick={handleSupportClick}>Chính sách đổi - trả - hoàn tiền</Typography>
          <Typography variant="body2" sx={linkStyle} onClick={handleSupportClick}>Chính sách bảo hành - bồi hoàn</Typography>
          <Typography variant="body2" sx={linkStyle} onClick={handleSupportClick}>Chính sách vận chuyển</Typography>
          <Typography variant="body2" sx={linkStyle} onClick={handleSupportClick}>Chính sách khách sỉ</Typography>
          <br />
          <Typography variant="body2" className="footer-section-2" sx={{ marginBottom: '5px' }}>✉️ cskh@bookify.com.vn</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={2.5} className="footer-section">
          <Typography variant="h6" sx={linkStyle} onClick={handleAccountClick}>TÀI KHOẢN CỦA TÔI</Typography>
          <Typography variant="body2" sx={linkStyle} onClick={handleAccountClick}>
            Đăng nhập/Tạo mới tài khoản
          </Typography>
          <Typography variant="body2" sx={linkStyle} onClick={handleAccountClick}>Thay đổi địa chỉ khách hàng</Typography>
          <Typography variant="body2" sx={linkStyle} onClick={handleAccountClick}>Chi tiết tài khoản</Typography>
          <Typography variant="body2" sx={linkStyle} onClick={handleAccountClick}>Lịch sử mua hàng</Typography>
          <br />
          <Typography variant="body2" className="footer-section-2" sx={{ marginBottom: '5px' }}>✆ 1900 636 467</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

// Style cho link hover
const linkStyle = {
  marginBottom: '5px',
  cursor: 'pointer',
  transition: 'color 0.2s ease, text-shadow 0.2s ease',
  '&:hover': {
    // fontWeight: 'bold',
    textShadow: '0 0 1px ', // Hiệu ứng bóng cho chữ
  },
};



export default Footer;
