// StaffLayout.jsx
import React from 'react';
import { Layout, theme, Avatar, Dropdown, Button, Badge, Breadcrumb } from 'antd';
import { BellOutlined, UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import StaffSideBar from '../StaffLayout/StaffSideBar/StaffSideBar';
import { Outlet, useLocation } from 'react-router-dom';
import '../StaffLayout/StaffLayout.css'; // Create this file for custom styles

const { Header, Content, Footer } = Layout;

const StaffLayout = () => {
    const [collapsed, setCollapsed] = React.useState(false);
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter((i) => i);

    const {
        token: { colorBgContainer, borderRadiusLG, colorPrimary },
    } = theme.useToken();

    // Generate breadcrumbs based on current path
    const breadcrumbItems = pathSnippets.map((snippet, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return {
            title: snippet.charAt(0).toUpperCase() + snippet.slice(1).replace('-', ' '),
            href: url,
        };
    });

    const userMenu = (
        <div className="user-dropdown-menu">
            <div className="user-info-header">
                <Avatar size={64} icon={<UserOutlined />} />
                <h3>Admin User</h3>
                <p>admin@example.com</p>
            </div>
            <Dropdown.Item>My Profile</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Logout</Dropdown.Item>
        </div>
    );

    return (
        <Layout className="app-layout">
            <StaffSideBar collapsed={collapsed} />
            <Layout>
                <Header className="app-header" style={{ background: colorBgContainer }}>
                    <div className="header-left">
                        <Button 
                            type="text" 
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="trigger-button"
                        />
                        <Breadcrumb 
                            items={[{title: 'Home'}, ...breadcrumbItems]} 
                            className="header-breadcrumb" 
                        />
                    </div>
                    <div className="header-right">
                        <Badge count={5} className="notification-badge">
                            <Button type="text" icon={<BellOutlined />} className="header-button" />
                        </Badge>
                        <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                            <Avatar icon={<UserOutlined />} className="avatar-dropdown" />
                        </Dropdown>
                    </div>
                </Header>
                <Content className="app-content">
                    <div
                        className="content-container"
                        style={{
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            padding: 24,
                            minHeight: 'calc(100vh - 134px)' // Adjust based on header and footer height
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer className="app-footer">
                    BookStore Management System ©{new Date().getFullYear()}
                </Footer>
            </Layout>
        </Layout>
    );
};

export default StaffLayout;