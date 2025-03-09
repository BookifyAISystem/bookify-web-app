import React from 'react';
import { Box, Divider, Typography, Grid } from '@mui/material';
import logo from '../../assets/images/logo1.png';
import './Footer.css';

const Footer = () => {
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
          <Typography variant="h6" sx={{marginBottom: '5px'}}>DỊCH VỤ</Typography>
          <Typography variant="body2" sx={{marginBottom: '5px'}}>Điều khoản sử dụng</Typography>
          <Typography variant="body2" sx={{marginBottom: '5px'}}>Chính sách bảo mật thông tin cá nhân</Typography>
          <Typography variant="body2" sx={{marginBottom: '5px'}}>Chính sách bảo mật thanh toán</Typography>
          <Typography variant="body2" sx={{marginBottom: '5px'}}>Giới thiệu Bookify</Typography>
          <Typography variant="h6" sx={{marginBottom: '5px'}}>LIÊN HỆ</Typography>
          <Typography variant="body2" sx={{marginBottom: '5px'}}>📍 60-62 Lê Lợi, Q.1, TP. HCM</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={2.5} className="footer-section">
          <Typography variant="h6" sx={{marginBottom: '5px'}}>HỖ TRỢ</Typography>
          <Typography variant="body2" sx={{marginBottom: '5px'}}>Chính sách đổi - trả - hoàn tiền</Typography>
          <Typography variant="body2" sx={{marginBottom: '5px'}}>Chính sách bảo hành - bồi hoàn</Typography>
          <Typography variant="body2" sx={{marginBottom: '5px'}}>Chính sách vận chuyển</Typography>
          <Typography variant="body2" sx={{marginBottom: '5px'}}>Chính sách khách sỉ</Typography>
          <br></br> <br></br>
          <Typography variant="body2" className="footer-section-2" sx={{marginBottom: '5px'}}>✉️ cskh@bookify.com.vn</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={2.5} className="footer-section">
          <Typography variant="h6" sx={{marginBottom: '5px'}}>TÀI KHOẢN CỦA TÔI</Typography>
          <Typography variant="body2" sx={{marginBottom: '5px'}}>Đăng nhập/Tạo mới tài khoản</Typography>
          <Typography variant="body2" sx={{marginBottom: '5px'}}>Thay đổi địa chỉ khách hàng</Typography>
          <Typography variant="body2" sx={{marginBottom: '5px'}}>Chi tiết tài khoản</Typography>
          <Typography variant="body2" sx={{marginBottom: '5px'}}>Lịch sử mua hàng</Typography>
          <br></br> <br></br>
          <Typography variant="body2" className="footer-section-2" sx={{marginBottom: '5px'}}>✆ 1900 636 467</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
