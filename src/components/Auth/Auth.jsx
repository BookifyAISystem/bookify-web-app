import React, { useState } from 'react';
import { Container, TextField, Button, Tabs, Tab, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { login, decodeToken, register, loginWithGoogle } from '../../services/accountService';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import auth from "../../services/firebaseConfig";
import { useNavigate } from 'react-router-dom';

const provider = new GoogleAuthProvider();


const Auth = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0); // 0: Đăng nhập, 1: Đăng ký, 2: Khôi phục mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(''); // Thêm state cho xác nhận mật khẩu
  const [password, setPassword] = useState(''); // Thêm state cho mật khẩu
  const [newPassword, setNewPassword] = useState(''); // Thêm state cho mật khẩu mới
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');

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
      const response = await login({
        email: email,
        password: password,
      });
  
      if (response) {
        alert("Đăng nhập thành công!");
        

        switch (response.toLowerCase()) {
          case "user":
            window.location.href = '/';
            break;
          case "staff":
            window.location.href = '/staff';
            break;
          case "admin":
            window.location.href = '/admin';
            break;
          default:
            break;
        }
      } else {
        alert("Email hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error(error.message);
      alert("Có lỗi xảy ra khi đăng nhập!");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const authInstance = getAuth();
      const result = await signInWithPopup(authInstance, provider);
      const googleToken = await result.user.getIdToken();
  
      console.log("Google Token:", googleToken);
  
      const role = await loginWithGoogle(googleToken);
  
      if (role) {
        alert("Đăng nhập thành công!");
        switch (role.toLowerCase()) {
          case "user":
            window.location.href = "/";
            break;
          case "staff":
            window.location.href = "/staff";
            break;
          case "admin":
            window.location.href = "/admin";
            break;
          default:
            break;
        }
      } else {
        alert("Lỗi đăng nhập Google.");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập với Google:", error);
      alert("Có lỗi xảy ra khi đăng nhập với Google!");
    }
  };
  
  
  
  
  const handleRegister = async () => {
    try {
      if (!/^[a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẮẰẲẴẶắằẳẵặƯứừửữự]+$/.test(userName)) {
        alert("UserName must not contain special characters.");
        return;
      }

      if (userName.length < 5) {
        alert("User name must be at least 5 characters long.");
        return;
      }

      if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Email must be a valid email address.");
        return;
      }

      if (!/^0\d{9}$/.test(phone)) {
        alert("Phone number must begin with 0 and be 10 digits long.");
        return;
      }

      if (fullName.length < 10 || fullName.length > 200) {
        alert("Full name must be between 10 and 200 characters long.");
        return;
      }
      if (/[^a-zA-Z0-9\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẮẰẲẴẶắằẳẵặƯứừửữự]/.test(fullName)) {
        alert("Full name must not contain special characters.");
        return;
      }

      const response = await register({
        UserName: userName,
        Password: password,
        Email: email,
        PhoneNumber: phone,
        Address: null,
        FullName: fullName,
        Avatar: null
      });
      console.log("Đăng ký thành công!");
      alert("Đăng ký thành công!");
      setCurrentTab(0);
      resetFields();
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
              label="Email" 
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
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
            <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={handleGoogleLogin}>Đăng nhập với Google</Button>
          </Box>
        )}

        {/* ĐĂNG KÝ */}
        {currentTab === 1 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Đăng ký</Typography>
            <TextField
              fullWidth
              label="Fullname"
              margin="normal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Email"
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
            <TextField
              fullWidth
              label="Phone Number"
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
