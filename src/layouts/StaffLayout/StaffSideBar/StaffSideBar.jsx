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
    return (
        <Sider width={200} className="site-layout-background">
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{ height: '100%', borderRight: 0 }}
            >
                <Menu.Item key="1" icon={<UserOutlined />}>
                    Hi .......
                </Menu.Item>
                <Menu.Item key="2" icon={<BookOutlined />}>
                    <Link to="/staff/book-warehouse">Kho sách</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<ShoppingCartOutlined />}>
                    <Link to="/staff/orders">Đơn hàng</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<TagOutlined />}>
                    <Link to="/staff/vouchers">Mã giảm giá</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<LogoutOutlined />}>
                    Đăng xuất
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default StaffSideBar;