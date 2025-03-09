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
} from "antd";
import { UserOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import "./Profile.scss"; // Import SCSS

const { Title } = Typography;

const ProfileView = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1"); // State lưu tab đang chọn

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getAccountById(id);
      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [id]);

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
              <Descriptions.Item label="Role ID">{profile.roleId || "N/A"}</Descriptions.Item>
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
            <p>Danh sách đơn hàng sẽ hiển thị ở đây.</p>
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
