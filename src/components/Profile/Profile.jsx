import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAccountById } from "../../services/accountService";
import {
  Card,
  Avatar,
  Tabs,
  Descriptions,
  Spin,
  Alert,
  Button,
  Typography,
  Input,
  Table,
} from "antd";
import { UserOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import { getOrdersByAccount } from "../../services/orderService";
import { getRoleById } from "../../services/roleService";
import { useNavigate } from "react-router-dom";
import "./Profile.scss"; // Import SCSS

const { Title } = Typography;

const ProfileView = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1"); // State lưu tab đang chọn
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "3") {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
          const data = await getOrdersByAccount(id,2);
          setOrders(data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setOrdersLoading(false);
        }
      };
  
      fetchOrders();
    }
  }, [activeTab, id]);


  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getAccountById(id);
      if (data) {
        const role = await fetchRole(data.roleId);
        data.roleName = role;
        setProfile(data);

      }
      setLoading(false);
    };

    fetchProfile();
  }, [id]);

  const fetchRole = async (roleId) => {
    const role = await getRoleById(roleId);
    return role ? role.roleName : roleId;
  };


  if (loading)
    return (
      <div className="profile-container">
        <Spin tip="Loading..." size="large" />
      </div>
    );

  if (!profile)
    return (
      <div className="profile-container">
        <Alert message="Profile not found" type="error" showIcon />
      </div>
    );

    const handleViewOrder = (orderId) => {
      navigate(`/order/${orderId}`);
    };

    
    // Cột của DataGrid
  const columns = [
    { title: "Mã đơn hàng", dataIndex: "orderId", key: "orderId" },
    { title: "Ngày tạo", dataIndex: "createdDate", key: "createdDate", render: (date) => new Date(date).toLocaleString() },
    { title: "Tổng tiền", dataIndex: "total", key: "total", render: (total) => `${total.toLocaleString()} VND` },
    { title: "Trạng thái", dataIndex: "status", key: "status", render: (status) => status === 2 ? "Đã gửi" : "Đã giao" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleViewOrder(record.orderId)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  // Nội dung bên phải thay đổi theo tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "1": // Hồ sơ cá nhân
        return (
          <Card title="Hồ sơ cá nhân" bordered={false} className="profile-card">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Username">{profile.username || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Email">{profile.email || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Phone">{profile.phone || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Role">{profile.roleName || "N/A"}</Descriptions.Item>
            </Descriptions>
            <div className="profile-actions-right">
              <Button type="primary" icon={<EditOutlined />}>
                Chỉnh sửa thông tin
              </Button>
            </div>
          </Card>
        );

      case "2": // Đổi mật khẩu
        return (
          <Card title="Đổi mật khẩu" bordered={false} className="profile-card">
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu cũ" />
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" style={{ marginTop: 10 }} />
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" style={{ marginTop: 10 }} />
            <div className="profile-actions-right">
              <Button type="primary">Cập nhật mật khẩu</Button>
            </div>
          </Card>
        );

      case "3": // Đơn hàng của tôi
        return (
          <Card title="Đơn hàng của tôi" bordered={false} className="profile-card">
            {ordersLoading ? (
              <Spin tip="Loading..." size="large" />
            ) : orders.length > 0 ? (
              <Table dataSource={orders} columns={columns} rowKey="orderId" pagination={{ pageSize: 5 }} />
            ) : (
              <Alert message="Không có đơn hàng nào." type="info" showIcon />
            )}
          </Card>
        );

      case "4": // Ví voucher
        return (
          <Card title="Ví voucher" bordered={false} className="profile-card">
            <p>Danh sách voucher của bạn.</p>
          </Card>
        );

      case "5": // Wishlist
        return (
          <Card title="Wishlist" bordered={false} className="profile-card">
            <p>Sản phẩm yêu thích của bạn.</p>
          </Card>
        );

      case "6": // Bookshelf
        return (
          <Card title="Bookshelf" bordered={false} className="profile-card">
            <p>Danh sách sách theo bộ của bạn.</p>
          </Card>
        );

      case "7": // Feedback của tôi
        return (
          <Card title="Feedback của tôi" bordered={false} className="profile-card">
            <p>Danh sách nhận xét của bạn.</p>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      {/* Sidebar dạng dọc */}
      <Card className="sidebar-card">
        <div className="avatar-wrapper">
          <Avatar size={100} icon={<UserOutlined />} />
          <Title level={4} className="display-name">{profile.displayName}</Title>
        </div>

        <Tabs
          defaultActiveKey="1"
          tabPosition="left"
          className="vertical-tabs"
          onChange={setActiveTab} // Cập nhật tab đang chọn
        >
          <Tabs.TabPane tab="Hồ sơ cá nhân" key="1" />
          <Tabs.TabPane tab="Đổi mật khẩu" key="2" />
          <Tabs.TabPane tab="Đơn hàng của tôi" key="3" />
          <Tabs.TabPane tab="Ví voucher" key="4" />
          <Tabs.TabPane tab="Wishlist" key="5" />
          <Tabs.TabPane tab="Bookshelf" key="6" />
          <Tabs.TabPane tab="Feedback của tôi" key="7" />
        </Tabs>
      </Card>

      {/* Nội dung bên phải thay đổi theo tab */}
      {renderTabContent()}
    </div>
  );
};

export default ProfileView;
