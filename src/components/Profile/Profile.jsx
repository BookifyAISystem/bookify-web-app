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
import { getOrdersByAccount, getAllOrders } from "../../services/orderService";
import { getBookById } from "../../services/bookService";
import { getRoleById } from "../../services/roleService";
import { useNavigate } from "react-router-dom";
import { getAllWishLists } from "../../services/wishListService";
import { getAllWishListDetails, deleteWishListDetail } from "../../services/wishListDetailService";
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
  const [wishlist, setWishlist] = useState([]);
const [wishlistLoading, setWishlistLoading] = useState(false);
  const [myBooks, setMyBooks] = useState([]);
const [myBooksLoading, setMyBooksLoading] = useState(false);
const handleRemoveFromWishlist = async (wishlistDetailId) => {
  try {
    await deleteWishListDetail(wishlistDetailId);
    // Cập nhật lại danh sách sau khi xoá
    setWishlist(prev => prev.filter(book => book.wishlistDetailId !== wishlistDetailId));
  } catch (error) {
    console.error("Lỗi khi xoá khỏi wishlist:", error);
  }
};



  useEffect(() => {
    if (activeTab === "3") {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
          // Fetch orders for multiple statuses and combine the results
          const statusList = [0, 2, 3, 4];
          const orderPromises = statusList.map(status => getOrdersByAccount(id, status));
          const ordersResults = await Promise.all(orderPromises);
          
          // Flatten the array of arrays and calculate totals
          const data = ordersResults.flat();
          
          const updatedOrders = data.map(order => ({
            ...order,
            total: order.orderDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0)
          }));
  
          setOrders(updatedOrders);
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
    if (activeTab === "5") {
      const fetchWishlist = async () => {
        setWishlistLoading(true);
        try {
          const allWishlists = await getAllWishLists();
          const userWishlist = allWishlists.find(w => w.accountId === parseInt(id));
          
  
          if (userWishlist) {
            const allDetails = await getAllWishListDetails();
            const userBooks = allDetails
              .filter(detail => detail.wishlistId === userWishlist.wishlistId)
              .map(detail => ({
                wishlistDetailId: detail.wishlistDetailId,
                bookId: detail.book.bookId,
                bookName: detail.book.bookName,
                bookImage: detail.book.bookImage,
              }));
  
            setWishlist(userBooks);
          } else {
            setWishlist([]);
          }
        } catch (error) {
          console.error("Lỗi khi lấy wishlist:", error);
        } finally {
          setWishlistLoading(false);
        }
      };
  
      fetchWishlist();
    }
  }, [activeTab, id]);
  useEffect(() => {
    if (activeTab === "8") {
      const fetchMyBooks = async () => {
        setMyBooksLoading(true);
        try {
          const allOrders = await getAllOrders();
          const filteredOrders = allOrders.filter(
            (order) => order.accountId === parseInt(id) && order.status === 4
          );
      
          const allDetails = filteredOrders.flatMap(order => order.orderDetails);
      
          // Gộp quantity theo bookId
          const bookQuantityMap = new Map();
          for (const detail of allDetails) {
            const currentQty = bookQuantityMap.get(detail.bookId) || 0;
            bookQuantityMap.set(detail.bookId, currentQty + detail.quantity);
          }
      
          // Gọi API getBookById cho từng bookId duy nhất
          const books = await Promise.all(
            Array.from(bookQuantityMap.entries()).map(async ([bookId, quantity]) => {
              const book = await getBookById(bookId);
              return {
                bookId,
                bookName: book?.bookName || `Sách #${bookId}`,
                bookImage: book?.bookImage || "/placeholder-book.png",
                quantity,
              };
            })
          );
      
          setMyBooks(books);
        } catch (error) {
          console.error("Lỗi khi lấy sách đã mua:", error);
        } finally {
          setMyBooksLoading(false);
        }
      };
      
      
  
      fetchMyBooks();
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
      // Lưu trạng thái tab trước khi điều hướng
      sessionStorage.setItem("lastActiveTab", activeTab);
  
      // Điều hướng đến trang chi tiết đơn hàng
      navigate(`/order/${orderId}`);
  };
  
    const getStatusText = (status) => {
      switch (status) {
        case 1:
          return { text: "Trong giỏ hàng", color: "#007bff" }; // Blue
        case 2:
          return { text: "Đã đặt", color: "#ff9800" }; // Orange
        case 3:
          return { text: "Đã Thanh Toán", color: "#4caf50" }; // Green
        case 4:
          return { text: "Đã Hoàn Thành", color: "#4caf50" }; 
        case 0:
          return { text: "Đã hủy", color: "#f44336" };
        default:
          return { text: "Không xác định", color: "#9e9e9e" }; // Grey
      }
    };
    
    // Cột của DataGrid
    const columns = [
      { title: "Mã đơn hàng", dataIndex: "orderId", key: "orderId" },
      { title: "Ngày tạo", dataIndex: "createdDate", key: "createdDate", render: (date) => new Date(date).toLocaleString() },
      { title: "Tổng tiền", dataIndex: "total", key: "total", render: (total) => `${total.toLocaleString()} VND` },
      { 
        title: "Trạng thái", 
        dataIndex: "status", 
        key: "status", 
        render: (status) => {
          const { text, color } = getStatusText(status);
          return <span style={{ color }}>{text}</span>;
        }
      },
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
            ) : orders?.length > 0 ? (
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
            {wishlistLoading ? (
              <Spin tip="Đang tải wishlist..." size="large" />
            ) : wishlist.length > 0 ? (
              <div className="book-list">
                {wishlist.map(book => (
                  <div
                    key={book.wishlistDetailId}
                    className="book-item"
                    onClick={() => navigate(`/book/${book.bookId}`)}
                  >
                    <div className="wishlist-fav-icon">💖</div>
                    <img src={book.bookImage} alt={book.bookName} className="book-thumbnail" />
                    <div className="book-info">
                      <strong>{book.bookName}</strong>
                      <Button
                        danger
                        size="small"
                        style={{ marginTop: "6px" }}
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn click vào card
                          handleRemoveFromWishlist(book.wishlistDetailId);
                        }}
                      >
                        Xoá
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert message="Bạn chưa có sản phẩm yêu thích nào." type="info" showIcon />
            )}
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
        case "8": // Sách của tôi
  return (
    <Card title="Sách của tôi" bordered={false} className="profile-card">
      {myBooksLoading ? (
        <Spin tip="Đang tải sách..." size="large" />
      ) : myBooks.length > 0 ? (
        <div className="book-list">
          {myBooks.map(book => (
            <div
            key={book.bookId}
            className="book-item"
            onClick={() => navigate(`/book-reader/${book.bookId}`)}
            style={{ cursor: 'pointer' }} // thêm hiệu ứng chuột
          >
            <img src={book.bookImage} alt={book.bookName} className="book-thumbnail" />
            <div className="book-info">
              <strong>{book.bookName}</strong>
              <p>Số lượng: {book.quantity}</p>
            </div>
          </div>
          
          ))}
        </div>
      ) : (
        <Alert message="Bạn chưa có sách nào." type="info" showIcon />
      )}
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
          <Tabs.TabPane tab="Sách của tôi" key="8" />

        </Tabs>
      </Card>

      {/* Nội dung bên phải thay đổi theo tab */}
      {renderTabContent()}
    </div>
  );
};

export default ProfileView;
