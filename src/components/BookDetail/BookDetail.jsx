import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../../services/bookService";
import { getAccountID } from "../../services/accountService";
import { createOrder, getOrderByAccount } from "../../services/orderService";
import { getOrderDetailsByOrderId, createOrderDetail, updateOrderDetail } from "../../services/orderDetailService";
import { getBookContentVersionByBookId } from "../../services/bookContentVersion";
import "./BookDetail.css";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [contentData, setContentData] = useState([]);
  const [currentSummaryIndex, setCurrentSummaryIndex] = useState(0);
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [displaySummary, setDisplaySummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  
  useEffect(() => {
    const fetchBookDetail = async () => {
      const data = await getBookById(id);
      if (data) {
        setBook(data);
      }
      setLoading(false);
    };

    fetchBookDetail();
  }, [id]);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => quantity > 1 && setQuantity(quantity - 1);

  const handleAddToCart = async () => {
    const accountId = getAccountID();
    if (!accountId) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng.");
      return;
    }
  
    try {
      let order = await getOrderByAccount(accountId);
      let isNewOrder = false;
  
      if (!order || !order.orderId || order.status !== 1) {
        console.log("🚀 Tạo đơn hàng mới...");
        order = await createOrder({
          accountId: accountId,
          voucherId: null,
          orderDetails: [
            {
              bookId: book.bookId,
              quantity: quantity,
              price: book.price
            }
          ]
        });
  
        isNewOrder = true;
  
        // Đợi backend xử lý xong
        await new Promise((res) => setTimeout(res, 500));
  
        // Lấy lại đơn hàng mới tạo
        order = await getOrderByAccount(accountId);
        if (!order || !order.orderId) {
          alert("Không thể tạo đơn hàng mới. Vui lòng thử lại.");
          return;
        }
  
        console.log("✅ Đã tạo đơn hàng mới với sản phẩm!");
        alert("🎉 Đã thêm sản phẩm vào giỏ hàng!");
        return; // ⛔ Không cần chạy createOrderDetail nữa
      }
  
      const orderId = order.orderId;
      console.log(`✅ Đơn hàng hợp lệ có ID: ${orderId}`);
  
      let orderDetails = await getOrderDetailsByOrderId(orderId);
      if (!Array.isArray(orderDetails)) orderDetails = [];
  
      let existingItem = orderDetails.find(
        (detail) => detail.bookId === book.bookId && detail.orderId === orderId
      );
  
      if (existingItem) {
        await updateOrderDetail(existingItem.orderDetailId, {
          orderId: orderId,
          bookId: book.bookId,
          quantity: existingItem.quantity + quantity,
          price: book.price,
          status: 1
        });
      } else {
        await createOrderDetail(order.orderId, {
          bookId: book.bookId,
          quantity: quantity,
          price: book.price
        });
  
        await new Promise((res) => setTimeout(res, 500));
      }
  
      alert(`🎉 Đã thêm sản phẩm vào giỏ hàng!`);
    } catch (error) {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
      alert("Đã xảy ra lỗi khi thêm vào giỏ hàng.");
    }
  };
  

  const handleShowSummary = () => {
    setShowSummary(true);
    if (contentData.length === 0) {
      setGeneratedSummary("");
      setDisplaySummary("");
    }
  };

  const handleGenerateAISummary = async () => {
    try {
      const data = await getBookContentVersionByBookId(id);
      setContentData(data || []);
      
      if (data?.[0]?.summaries?.length > 0) {
        const firstSummary = data[0].summaries[0]?.toString().replace(/undefined/g, '');
        setGeneratedSummary(firstSummary);
        setCurrentSummaryIndex(0);
      }
    } catch (error) {
      console.error("Lỗi khi tải tóm tắt:", error);
    }
  };

  const handleRegenerate = () => {
    if (!contentData?.[0]?.summaries) return;
    
    const summaries = contentData[0].summaries;
    const newIndex = (currentSummaryIndex + 1) % summaries.length;
    const nextSummary = summaries[newIndex]?.toString() || "";
    // const nextSummary = summaries[newIndex]?.toString().replace(/undefined/g, '') || "";
    
    setCurrentSummaryIndex(newIndex);
    setGeneratedSummary(nextSummary);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      alert("Vui lòng nhập mô tả để tạo ảnh.");
      return;
    }
  
    setLoadingImage(true);
    setGeneratedImage(null); // Xóa ảnh cũ
  
    try {
      const response = await fetch(`http://minetsbd.fun:5002/api/v1/open-ai/generateImage?input=${encodeURIComponent(imagePrompt)}`);
      const data = await response.json();
      
      console.log("📢 API Response:", data); // Debug API response
  
      if (data) {
        setGeneratedImage(data);
        console.log("✅ Cập nhật state: ", data);
      } else {
        alert("Không thể tạo ảnh, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi tạo ảnh:", error);
      alert("Đã xảy ra lỗi khi tạo ảnh.");
    } finally {
      setLoadingImage(false);
    }
  };
  
  
  
  

  useEffect(() => {
    let intervalId;
    let currentCharIndex = 0;
    
    if (showSummary && generatedSummary) {
      // Đảm bảo generatedSummary là string hợp lệ
      const safeSummary = generatedSummary.toString().replace(/undefined/g, '');
      
      setDisplaySummary("");
      
      intervalId = setInterval(() => {
        if (currentCharIndex < safeSummary.length) {
          setDisplaySummary(prev => {
            // Kiểm tra ký tự hiện tại
            const currentChar = safeSummary[currentCharIndex-1] || '';
            return prev + currentChar;
          });
          console.log("🔄 Cập nhật tóm tắt:", displaySummary);
          currentCharIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 30);
    }

    return () => {
      clearInterval(intervalId);
      currentCharIndex = 0;
    };
  }, [showSummary, generatedSummary]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!book) return <p>Không tìm thấy sách!</p>;

  return (
    <div className="book-detail-container">
      <div className="book-detail">
        <div className="book-detail-left">
          <img src={book.bookImage} alt={book.bookName} className="book-detail-image" />

          <div className="quantity-selector">
            <button className="quantity-btn" onClick={handleDecrease}>-</button>
            <span className="quantity-number">{quantity}</span>
            <button className="quantity-btn" onClick={handleIncrease}>+</button>
          </div>

          <div className="book-actions">
            <button className="add-to-cart" onClick={handleAddToCart}>
              <i className="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
            </button>
            <button className="buy-now">Mua ngay</button>
          </div>

          <div className="book-policies">
            <h3>Chính sách ưu đãi của Bookify</h3>
            <ul>
              <li><i className="fas fa-truck"></i> Thời gian giao hàng: Giao nhanh và uy tín</li>
              <li><i className="fas fa-exchange-alt"></i> Chính sách đổi trả: Đổi trả miễn phí toàn quốc</li>
              <li><i className="fas fa-users"></i> Chính sách khách sỉ: Ưu đãi khi mua số lượng lớn</li>
            </ul>
          </div>
        </div>

        <div className="book-detail-right">
          <h1 className="book-title">{book.bookName}</h1>

          <div className="book-price-section">
            <p className="book-price">Giá sách in: <strong>{book.price.toLocaleString()} VND</strong></p>
            {book.priceEbook && (
              <p className="book-ebook-price">Giá sách điện tử: <strong>{book.priceEbook.toLocaleString()} VND</strong></p>
            )}
          </div>

          <div className="book-description">
            <h3>Mô tả</h3>
            <p>{book.description}</p>
          </div>

          <div className="book-specifications">
            <h3>Thông tin chi tiết</h3>
            <table>
              <tbody>
                <tr>
                  <th>Năm xuất bản</th>
                  <td>{book.publishYear || "Đang cập nhật"}</td>
                </tr>
                <tr>
                  <th>Thể loại</th>
                  <td>{book.bookType || "Đang cập nhật"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="summary-section">
            <button 
              className="view-summary-btn"
              onClick={handleShowSummary}
            >
              <i className="fas fa-book-open"></i>
              Xem tóm tắt
            </button>

            <div className="image-generator">
              <textarea
                className="image-input"
                placeholder="Nhập mô tả ảnh..."
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
              ></textarea>
              <button 
                className="generate-image-btn" 
                onClick={handleGenerateImage} 
                disabled={loadingImage}
              >
                <i className="fas fa-image"></i> {loadingImage ? "Đang tạo..." : "Tạo ảnh"}
              </button>

              {/* Nút xem ảnh chỉ hiển thị khi có ảnh */}
              {generatedImage && (
                <button 
                  className="view-image-btn"
                  onClick={() => window.open(generatedImage, "_blank")}
                >
                  <i className="fas fa-eye"></i> Xem ảnh
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {showSummary && (
        <div className="modal show">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Tóm tắt sách: {book.bookName}</h2>
              <button className="close-btn" onClick={() => setShowSummary(false)}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              {contentData.length === 0 ? (
                <div className="empty-summary">
                  <button 
                    className="generate-ai-btn"
                    onClick={handleGenerateAISummary}
                  >
                    <i className="fas fa-robot"></i>
                    Tạo tóm tắt bằng AI
                  </button>
                </div>
              ) : (
                <>
                  <div className="summary-controls">
                    <button className="regenerate-btn" onClick={handleRegenerate}>
                      <i className="fas fa-sync-alt"></i>
                      Tạo bản mới ({currentSummaryIndex + 1}/{contentData[0]?.summaries?.length})
                    </button>
                  </div>
                  <div className="generating-text">
                    {displaySummary}
                    <span className="typing-cursor">|</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
