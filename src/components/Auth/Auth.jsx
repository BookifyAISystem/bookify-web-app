import React, { useState } from 'react';
import { Container, TextField, Button, Tabs, Tab, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Mock data for users
const mockUsers = [
  { id: 1, phone: '0123456789', email: 'john@example.com', password: '123' },
  { id: 2, phone: '0987654321', email: 'jane@example.com', password: 'asd' },
  { id: 3, phone: '0369852147', email: 'bob@example.com', password: '321' },
];

// Mock API function to simulate a network request
const mockApiCall = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Mock API call with data:", data);
      resolve({ success: true, message: "Operation successful" });
    });
  });
};

const Auth = () => {
  const [currentTab, setCurrentTab] = useState(0); // 0: Đăng nhập, 1: Đăng ký, 2: Khôi phục mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(''); // Thêm state cho xác nhận mật khẩu
  const [password, setPassword] = useState(''); // Thêm state cho mật khẩu
  const [newPassword, setNewPassword] = useState(''); // Thêm state cho mật khẩu mới
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Hàm để làm mới state
  const resetFields = () => {
    setShowPassword(false);
    setShowConfirmPassword(false);
    setConfirmPassword('');
    setPassword('');
    setNewPassword('');
    setEmail('');
    setPhone('');
  };

  // Cập nhật hàm đổi tab
  const handleChangeTab = (event, newValue) => {
    resetFields();
    setCurrentTab(newValue);
  };

  // Hàm kiểm tra xác nhận mật khẩu
  const isPasswordValid = () => {
    return showPassword && showConfirmPassword && confirmPassword === password; // Kiểm tra mật khẩu khớp
  };

  // Mock API functions
  const mockLogin = async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(
          u => (u.email === credentials.username || u.phone === credentials.username) 
          && u.password === credentials.password
        );
        
        if (user) {
          resolve({ success: true, message: 'Đăng nhập thành công', user });
        } else {
          reject({ success: false, message: 'Thông tin đăng nhập không chính xác' });
        }
      });
    });
  };

  const mockRegister = async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = mockUsers.find(
          u => u.phone === userData.phone || u.email === userData.email
        );

        if (existingUser) {
          reject({ success: false, message: 'Số điện thoại hoặc email đã tồn tại' });
        } else {
          const newUser = {
            id: mockUsers.length + 1,
            ...userData
          };
          mockUsers.push(newUser);
          resolve({ success: true, message: 'Đăng ký thành công', user: newUser });
        }
      });
    });
  };

  const mockResetPassword = async (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Attempting password reset with:", data);
        console.log("Current mock users:", mockUsers);
        
        const userIndex = mockUsers.findIndex(
          u => u.email === data.email || u.phone === data.phone
        );
        
        console.log("Found user index:", userIndex);

        if (userIndex !== -1) {
          mockUsers[userIndex].password = data.newPassword;
          resolve({ success: true, message: 'Đặt lại mật khẩu thành công' });
        } else {
          reject({ success: false, message: 'Không tìm thấy tài khoản' });
        }
      });
    });
  };

  // Handler functions
  const handleLogin = async () => {
    try {
      const response = await mockLogin({ 
        username: email,
        password: password 
      });
      console.log(response.message);
      alert(response.message);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await mockRegister({
        phone: phone,
        email: email,
        password: password
      });
      console.log(response.message);
      alert(response.message);
      setCurrentTab(0);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (!email && !phone) {
        alert('Vui lòng nhập email hoặc số điện thoại');
        return;
      }

      const response = await mockResetPassword({
        email: email || '',
        phone: phone || '',
        newPassword: newPassword
      });
      console.log(response.message);
      alert(response.message);
      setCurrentTab(0);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{paddingBottom: '1%'}}>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Tabs value={currentTab} onChange={handleChangeTab} centered>
          <Tab label="Đăng nhập" />
          <Tab label="Đăng ký" />
          <Tab label="Khôi phục tài khoản" />
        </Tabs>

        {/* ĐĂNG NHẬP */}
        {currentTab === 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Đăng nhập</Typography>
            <TextField 
              fullWidth 
              label="Số điện thoại/Email" 
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleLogin}>Đăng nhập</Button>
            <Button fullWidth sx={{ mt: 1 }} onClick={() => setCurrentTab(2)}>Quên mật khẩu?</Button>
          </Box>
        )}

        {/* ĐĂNG KÝ */}
        {currentTab === 1 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Đăng ký</Typography>
            <TextField
              fullWidth
              label="Số điện thoại"
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button variant="outlined" size="small">Gửi mã OTP</Button>
                  </InputAdornment>
                ),
              }}
            />
            <TextField fullWidth label="Mã xác nhận OTP" margin="normal" />
            <TextField
              fullWidth
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? "text" : "password"}
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPassword && confirmPassword !== password}
              helperText={confirmPassword && confirmPassword !== password ? "Mật khẩu không khớp" : ""}
            />
            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleRegister}>Đăng ký</Button>
            <Button fullWidth sx={{ mt: 1 }} onClick={() => setCurrentTab(0)}>Trở về</Button>
          </Box>
        )}

        {/* KHÔI PHỤC MẬT KHẨU */}
        {currentTab === 2 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Khôi phục mật khẩu</Typography>
            <TextField
              fullWidth
              label="Số điện thoại/Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button variant="outlined" size="small">Gửi mã OTP</Button>
                  </InputAdornment>
                ),
              }}
            />
            <TextField fullWidth label="Mã xác nhận OTP" margin="normal" />
            <TextField
              fullWidth
              label="Mật khẩu mới"
              type={showConfirmPassword ? "text" : "password"}
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="Xác nhận mật khẩu mới"
              type={showConfirmPassword ? "text" : "password"}
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPassword && confirmPassword !== newPassword}
              helperText={confirmPassword && confirmPassword !== newPassword ? "Mật khẩu không khớp" : ""}
            />
            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handlePasswordReset}>Xác nhận</Button>
            <Button fullWidth sx={{ mt: 1 }} onClick={() => setCurrentTab(0)}>Trở về</Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Auth;
