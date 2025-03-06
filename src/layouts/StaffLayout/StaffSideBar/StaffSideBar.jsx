import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import {
    UserOutlined,
    BookOutlined,
    ShoppingCartOutlined,
    TagOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const StaffSideBar = () => {
  const [user, setUser] = useState(null);
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

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    alert('Đăng xuất thành công!');
    window.location.href = '/login';
  };

    return (
        <Sider width={200} className="site-layout-background">
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{ height: '100%', borderRight: 0 }}
            >
                <Menu.Item key="1" icon={<UserOutlined />}>
                    Hi {user?.name}
                </Menu.Item>
                <Menu.Item key="2" icon={<BookOutlined />}>
                    <Link to="/staff/book-warehouse">Kho sách</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<ShoppingCartOutlined />}>
                    <Link to="/staff/orders">Đơn hàng</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<TagOutlined />}>
                    <Link to="/staff/author">Tác giả</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<TagOutlined />}>
                    <Link to="/staff/category">Thể loại sách</Link>
                </Menu.Item>
                <Menu.Item key="6" icon={<TagOutlined />}>
                    <Link to="/staff/vouchers">Mã giảm giá</Link>
                </Menu.Item>
                <Menu.Item key="7" icon={<TagOutlined />}>
                    <Link to="/staff/feedback">Đánh giá</Link>
                </Menu.Item>
                <Menu.Item key="8" icon={<TagOutlined />}>
                    <Link to="/staff/note">Ghi chú</Link>
                </Menu.Item>
                <Menu.Item key="9" icon={<LogoutOutlined />} onClick={handleLogout}>
                    Đăng xuất
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default StaffSideBar;