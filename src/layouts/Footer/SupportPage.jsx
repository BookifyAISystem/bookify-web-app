import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const SupportPage = () => {
  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" gutterBottom align="center">HỖ TRỢ</Typography>
        
        <Typography variant="h4" gutterBottom>Chính sách đổi - trả - hoàn tiền</Typography>
        <Typography paragraph>
          Quý khách có thể yêu cầu đổi, trả hoặc hoàn tiền trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng. Sản phẩm yêu cầu đổi/trả cần đáp ứng các điều kiện sau:
          <ul>
            <li>Sản phẩm còn nguyên tem, nhãn mác, không có dấu hiệu đã qua sử dụng.</li>
            <li>Hóa đơn mua hàng hoặc thông tin đơn hàng đầy đủ.</li>
            <li>Trong trường hợp lỗi từ phía chúng tôi, quý khách sẽ được miễn phí vận chuyển khi đổi trả.</li>
          </ul>
          Vui lòng liên hệ bộ phận chăm sóc khách hàng qua hotline hoặc email để được hỗ trợ.
        </Typography>

        <Typography variant="h4" gutterBottom>Chính sách bảo hành - bồi hoàn</Typography>
        <Typography paragraph>
          Sản phẩm được bảo hành theo chính sách của nhà sản xuất. Các trường hợp áp dụng bảo hành/bồi hoàn:
          <ul>
            <li>Lỗi kỹ thuật từ nhà sản xuất.</li>
            <li>Hư hỏng do vận chuyển từ phía Bookify.</li>
            <li>Không đúng sản phẩm trong đơn hàng.</li>
          </ul>
          Quy trình bảo hành/bồi hoàn:
          <ol>
            <li>Gửi yêu cầu qua email hoặc hotline kèm theo hình ảnh sản phẩm và mô tả lỗi.</li>
            <li>Nhận hướng dẫn từ đội ngũ hỗ trợ.</li>
            <li>Gửi lại sản phẩm và nhận phản hồi trong vòng 3-5 ngày làm việc.</li>
          </ol>
        </Typography>

        <Typography variant="h4" gutterBottom>Chính sách vận chuyển</Typography>
        <Typography paragraph>
          Chúng tôi cam kết giao hàng nhanh chóng và an toàn đến tay khách hàng:
          <ul>
            <li>Thời gian giao hàng: từ 2-5 ngày làm việc tùy khu vực.</li>
            <li>Phí vận chuyển: được tính dựa trên trọng lượng đơn hàng và địa chỉ nhận hàng.</li>
            <li>Đơn vị vận chuyển: hợp tác với các đối tác uy tín để đảm bảo chất lượng dịch vụ.</li>
          </ul>
          Quý khách sẽ nhận được mã vận đơn để theo dõi quá trình vận chuyển sau khi đơn hàng được xác nhận.
        </Typography>

        <Typography variant="h4" gutterBottom>Chính sách khách sỉ</Typography>
        <Typography paragraph>
          Bookify luôn chào đón các đối tác muốn hợp tác lâu dài thông qua chính sách khách sỉ với nhiều ưu đãi hấp dẫn:
          <ul>
            <li>Chiết khấu lên đến 30% cho các đơn hàng lớn.</li>
            <li>Hỗ trợ truyền thông, cung cấp tài liệu quảng bá sản phẩm.</li>
            <li>Ưu tiên đặt hàng và cập nhật thông tin sản phẩm mới.</li>
          </ul>
          Để trở thành đối tác sỉ, quý khách vui lòng điền vào biểu mẫu đăng ký trên website hoặc liên hệ trực tiếp với bộ phận kinh doanh.
        </Typography>
      </Box>
    </Container>
  );
};

export default SupportPage;