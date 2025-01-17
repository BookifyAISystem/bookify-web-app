import React, { useState } from 'react';
import { Container, TextField, Button, Tabs, Tab, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Auth = () => {
  const [currentTab, setCurrentTab] = useState(0); // 0: Đăng nhập, 1: Đăng ký, 2: Khôi phục mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(''); // Thêm state cho xác nhận mật khẩu
  const [password, setPassword] = useState(''); // Thêm state cho mật khẩu
  const [newPassword, setNewPassword] = useState(''); // Thêm state cho mật khẩu mới

  // Hàm kiểm tra xác nhận mật khẩu
  const isPasswordValid = () => {
    return showPassword && showConfirmPassword && confirmPassword === password; // Kiểm tra mật khẩu khớp
  };

  return (
    <Container maxWidth="sm" sx={{paddingBottom: '1%'}}>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} centered>
          <Tab label="Đăng nhập" />
          <Tab label="Đăng ký" />
        </Tabs>

        {/* ĐĂNG NHẬP */}
        {currentTab === 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Đăng nhập</Typography>
            <TextField fullWidth label="Số điện thoại/Email" margin="normal" />
            <TextField
              fullWidth
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              margin="normal"
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
            <Button fullWidth variant="contained" sx={{ mt: 2 }}>Đăng nhập</Button>
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
            <Button fullWidth variant="contained" sx={{ mt: 2 }} disabled={!isPasswordValid()}>Đăng ký</Button>
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
            <Button fullWidth variant="contained" sx={{ mt: 2 }} disabled={!isPasswordValid()}>Xác nhận</Button>
            <Button fullWidth sx={{ mt: 1 }} onClick={() => setCurrentTab(0)}>Trở về</Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Auth;
