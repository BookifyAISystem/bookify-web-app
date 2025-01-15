import React from 'react';
import './Footer.css';
import logo from '../../assets/images/Logo.png'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <p>Lầu 5, 387-389 Hai Bà Trưng, Quận 3, TP HCM</p>
            <p>Công Ty Cổ Phần Phát Hành Sách TP HCM - FAHASA</p>
            <p>60 - 62 Lê Lợi, Quận 1, TP. HCM, Việt Nam</p>
            <p>Fahasa.com nhận đặt hàng trực tuyến và giao hàng tận nơi.</p>
            <p>KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng cũng như tất cả Hệ Thống Fahasa trên toàn quốc.</p>
        </div>
        <div className="footer-section">
            <h3>DỊCH VỤ</h3>
            <p>Điều khoản sử dụng</p>
            <p>Chính sách bảo mật thông tin cá nhân</p>
            <p>Chính sách bảo mật thanh toán</p>
            <p>Giới thiệu Fahasa</p>
            <h3>LIÊN HỆ</h3>
            <p>60-62 Lê Lợi, Q.1, TP. HCM</p>
        </div>
        <div className="footer-section">
            <h3>HỖ TRỢ</h3>
            <p>Chính sách đổi - trả - hoàn tiền</p>
            <p>Chính sách bảo hành - bồi hoàn</p>
            <p>Chính sách vận chuyển</p>
            <p>Chính sách khách sỉ</p>
            <br></br>
            <p>cskh@fahasa.com.vn</p>
        </div>
        <div className="footer-section">
            <h3>TÀI KHOẢN CỦA TÔI</h3>
            <p>Đăng nhập/Tạo mới tài khoản</p>
            <p>Thay đổi địa chỉ khách hàng</p>
            <p>Chi tiết tài khoản</p>
            <p>Lịch sử mua hàng</p>
            <br></br>
            <p>1900 636 467</p>
        </div>
      </div>

      
    </footer>
  );
};

export default Footer;
