import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const ServicePage = () => {
  return (
    <Container maxWidth="md">
      <Box py={4}>
        
        {/* Service Title */}
        <Typography variant="h4" gutterBottom align="center">DỊCH VỤ</Typography>

        {/* Terms of Use */}
        <Typography variant="h5" gutterBottom>Điều khoản sử dụng</Typography>
        <Typography paragraph>
          Việc sử dụng dịch vụ của Bookify đồng nghĩa với việc bạn đồng ý tuân thủ các điều khoản sau đây:
        <ul>
          <li>Người dùng cam kết cung cấp thông tin chính xác khi đăng ký tài khoản.</li>
          <li>Không sử dụng dịch vụ cho các mục đích vi phạm pháp luật hoặc gây ảnh hưởng đến người khác.</li>
          <li>Bookify có quyền đình chỉ hoặc chấm dứt tài khoản nếu phát hiện vi phạm điều khoản sử dụng.</li>
        </ul>
        </Typography>


        {/* Personal Information Privacy Policy */}
        <Typography variant="h5" gutterBottom>Chính sách bảo mật thông tin cá nhân</Typography>
        <Typography paragraph>
          Bookify cam kết bảo mật thông tin cá nhân của khách hàng:
        <ul>
          <li>Chỉ thu thập thông tin cần thiết cho việc cung cấp dịch vụ.</li>
          <li>Không chia sẻ thông tin của khách hàng với bên thứ ba khi chưa có sự đồng ý.</li>
          <li>Áp dụng các biện pháp an ninh để bảo vệ dữ liệu khách hàng khỏi truy cập trái phép.</li>
        </ul>
        </Typography>

        {/* Payment Privacy Policy */}
        <Typography variant="h5" gutterBottom>Chính sách bảo mật thanh toán</Typography>
        <Typography paragraph>
          Các giao dịch thanh toán trên Bookify được bảo mật với các tiêu chuẩn cao nhất:
        <ul>
          <li>Mọi thông tin thanh toán đều được mã hóa và truyền tải an toàn.</li>
          <li>Chúng tôi không lưu trữ thông tin thẻ ngân hàng của khách hàng.</li>
          <li>Hợp tác với các đối tác thanh toán uy tín để đảm bảo giao dịch an toàn.</li>
        </ul>
        </Typography>

        {/* About Bookify */}
        <Typography variant="h5" gutterBottom>Giới thiệu Bookify</Typography>
        <Typography paragraph>
          Bookify là nền tảng cung cấp sách trực tuyến, mang đến cho bạn những trải nghiệm đọc tuyệt vời:
        <ul>
          <li>Cung cấp hàng nghìn đầu sách thuộc nhiều thể loại khác nhau.</li>
          <li>Hỗ trợ dịch vụ giao hàng nhanh chóng và tiện lợi.</li>
          <li>Đội ngũ chăm sóc khách hàng tận tâm, sẵn sàng hỗ trợ 24/7.</li>
        </ul>
        </Typography>

      </Box>
    </Container>
  );
};

export default ServicePage;