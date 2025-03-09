// StaffSideBar.jsx
import React, { useEffect, useState } from 'react';
import { Layout, Menu, Avatar, Typography, Divider, theme } from 'antd';
import {
    UserOutlined,
    BookOutlined,
    ShoppingCartOutlined,
    TagOutlined,
    LogoutOutlined,
    HomeOutlined,
    GiftOutlined,
    CommentOutlined,
    FileTextOutlined,
    DashboardOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import '../StaffSideBar/StaffSideBar.css'; // Create this file for custom styles

const { Sider } = Layout;
const { Text, Title } = Typography;

const StaffSideBar = ({ collapsed }) => {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const { token } = theme.useToken();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser({
                name: userInfo["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                email: userInfo["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                role: userInfo["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
                avatar: null,
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        alert('Đăng xuất thành công!');
        window.location.href = '/login';
    };

    const getSelectedKeys = () => {
        const path = location.pathname;
        if (path.includes('book-warehouse')) return ['books'];
        if (path.includes('orders')) return ['orders'];
        if (path.includes('author')) return ['authors'];
        if (path.includes('category')) return ['categories'];
        if (path.includes('vouchers')) return ['vouchers'];
        if (path.includes('feedback')) return ['feedback'];
        if (path.includes('note')) return ['notes'];
        return ['dashboard'];
    };

    return (
        <Sider 
            width={240} 
            className="site-sidebar"
            theme="light"
            collapsible 
            collapsed={collapsed}
            style={{
                boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
                zIndex: 10
            }}
        >
            <div className="sidebar-header">
                {!collapsed && (
                    <Title level={4} style={{ margin: '16px 0', color: token.colorPrimary }}>
                        Bookify
                    </Title>
                )}
                {collapsed && (
                    <Title level={4} style={{ margin: '16px 0', color: token.colorPrimary }}>
                        📚
                    </Title>
                )}
            </div>
            
            {!collapsed && user && (
                <div className="sidebar-user-info">
                    <Avatar size={48} icon={<UserOutlined />} />
                    <div className="user-details">
                        <Text strong>{user.name}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{user.role}</Text>
                    </div>
                </div>
            )}

            <Divider style={{ margin: '8px 0' }} />
            
            <Menu
                mode="inline"
                selectedKeys={getSelectedKeys()}
                className="sidebar-menu"
                items={[
                    {
                        key: 'dashboard',
                        icon: <DashboardOutlined />,
                        label: <Link to="/staff/dashboard">Dashboard</Link>
                    },
                    {
                        key: 'books',
                        icon: <BookOutlined />,
                        label: <Link to="/staff/book-warehouse">Kho sách</Link>
                    },
                    {
                        key: 'orders',
                        icon: <ShoppingCartOutlined />,
                        label: <Link to="/staff/orders">Đơn hàng</Link>
                    },
                    {
                        key: 'authors',
                        icon: <UserOutlined />,
                        label: <Link to="/staff/author">Tác giả</Link>
                    },
                    {
                        key: 'categories',
                        icon: <TagOutlined />,
                        label: <Link to="/staff/category">Thể loại sách</Link>
                    },
                    {
                        key: 'vouchers',
                        icon: <GiftOutlined />,
                        label: <Link to="/staff/vouchers">Mã giảm giá</Link>
                    },
                    {
                        key: 'feedback',
                        icon: <CommentOutlined />,
                        label: <Link to="/staff/feedback">Đánh giá</Link>
                    },
                    {
                        key: 'notes',
                        icon: <FileTextOutlined />,
                        label: <Link to="/staff/note">Ghi chú</Link>
                    }
                ]}
            />
            
            <div className="sidebar-footer">
                <Menu 
                    mode="inline" 
                    className="logout-menu"
                    items={[
                        {
                            key: 'logout',
                            danger: true,
                            icon: <LogoutOutlined />,
                            label: 'Đăng xuất',
                            onClick: handleLogout
                        }
                    ]}
                />
            </div>
        </Sider>
    );
};

export default StaffSideBar;