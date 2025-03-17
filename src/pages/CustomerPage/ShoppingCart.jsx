import React, { useState, useEffect } from "react";
import {
    getAllOrderDetails,
    updateOrderDetail,
} from "../../services/orderDetailService";
import { getBookById } from "../../services/bookService";
import deleteIcon from "../../assets/icon/delete.svg";
import "./ShoppingCart.css";

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // ✅ Lấy danh sách sản phẩm từ OrderDetailService (chỉ lấy status = 1)
    const fetchCartData = async () => {
        try {
            const orderDetails = await getAllOrderDetails();
            if (orderDetails) {
                // Chỉ lấy các sản phẩm có status = 1
                const validOrders = orderDetails.filter(order => order.status === 1);

                const itemsWithBookDetails = await Promise.all(
                    validOrders.map(async (order) => {
                        const book = await getBookById(order.bookId);
                        return book
                            ? {
                                  orderDetailId: order.orderDetailId,
                                  orderId: order.orderId,
                                  bookId: order.bookId,
                                  title: book.bookName,
                                  image: book.bookImage,
                                  price: order.price,
                                  quantity: order.quantity,
                                  status: order.status,
                              }
                            : null;
                    })
                );

                setCartItems(itemsWithBookDetails.filter(item => item !== null));
            }
        } catch (error) {
            console.error("❌ Lỗi khi lấy dữ liệu giỏ hàng:", error);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    // ✅ Tính tổng tiền dựa trên các sản phẩm đã chọn
    const totalAmount = selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // ✅ Xử lý chọn / bỏ chọn sản phẩm
    const handleSelectItem = (item) => {
        let updatedSelectedItems;

        if (selectedItems.some((selected) => selected.orderDetailId === item.orderDetailId)) {
            updatedSelectedItems = selectedItems.filter(
                (selected) => selected.orderDetailId !== item.orderDetailId
            );
        } else {
            updatedSelectedItems = [...selectedItems, item];
        }

        setSelectedItems(updatedSelectedItems);
    };

    // ✅ Xử lý chọn tất cả
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map((item) => ({ ...item })));
        }
        setSelectAll(!selectAll);
    };

    // ✅ Xử lý cập nhật số lượng sản phẩm
    const handleQuantityChange = async (item, type) => {
        const newQuantity = type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    
        const updatedOrderDetail = {
            orderDetailId: item.orderDetailId,
            orderId: item.orderId,
            bookId: item.bookId,
            quantity: newQuantity,
            price: item.price,
            status: item.status,
        };

        console.log("📤 Gửi request cập nhật số lượng:", updatedOrderDetail);
    
        try {
            const response = await updateOrderDetail(item.orderDetailId, updatedOrderDetail);
            if (response === 204 || response) {
                console.log("✅ Cập nhật UI sau khi cập nhật số lượng.");
                fetchCartData(); // 🔄 Cập nhật giỏ hàng ngay sau khi update
            }
        } catch (error) {
            alert("❌ Lỗi khi cập nhật số lượng sản phẩm.");
            console.error("Lỗi cập nhật số lượng:", error);
        }
    };

    // ✅ Xóa sản phẩm (chuyển status = 0 thay vì xóa thật)
    const handleDeleteItem = async (item) => {
        try {
            const updatedOrderDetail = {
                ...item,
                status: 0, // Đánh dấu là đã xóa
            };

            const deleteResponse = await updateOrderDetail(item.orderDetailId, updatedOrderDetail);
            if (deleteResponse) {
                console.log("🗑 Sản phẩm đã được xóa (status = 0)");
                fetchCartData(); // 🔄 Cập nhật giỏ hàng ngay sau khi xóa
            } else {
                alert("❌ Lỗi khi xóa sản phẩm.");
            }
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
    };

    return (
        <div className="shopping-container">
            {/* Cột bên trái: Giỏ hàng */}
            <div className="shopping-cart">
                <h2>🛒 GIỎ HÀNG ({cartItems.length} sản phẩm)</h2>

                <div className="cart-header">
                    <div className="column checkbox-column">
                        <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </div>
                    <div className="column product-column">Chọn tất cả ({cartItems.length} sản phẩm)</div>
                    <div className="column quantity-column">Số lượng</div>
                    <div className="column price-column">Thành tiền</div>
                    <div className="column delete-column"></div>
                </div>

                {cartItems.length === 0 ? (
                    <p className="empty-cart">Không có sản phẩm nào trong giỏ hàng</p>
                ) : (
                    cartItems.map((item) => (
                        <div key={item.orderDetailId} className="cart-item">
                            <div className="column checkbox-column">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.some((selected) => selected.orderDetailId === item.orderDetailId)}
                                    onChange={() => handleSelectItem(item)}
                                />
                            </div>
                            <div className="column product-column">
                                <img src={item.image} alt={item.title} className="book-image" />
                                <div className="book-info">
                                    <p className="book-title">{item.title}</p>
                                    <p className="price">{item.price.toLocaleString()} đ</p>
                                </div>
                            </div>
                            <div className="column quantity-column">
                                <div className="quantity-control">
                                    <button className="qty-btn" onClick={() => handleQuantityChange(item, "decrease")}>-</button>
                                    <input type="text" value={item.quantity} className="qty-input" readOnly />
                                    <button className="qty-btn" onClick={() => handleQuantityChange(item, "increase")}>+</button>
                                </div>
                            </div>
                            <div className="column price-column">
                                <p className="total-price">{(item.price * item.quantity).toLocaleString()} đ</p>
                            </div>
                            <div className="column delete-column">
                                <button className="delete-button" onClick={() => handleDeleteItem(item)}>
                                    <img src={deleteIcon} alt="Xóa" className="delete-icon" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Cột bên phải: Thanh toán */}
            <div className="payment-summary">
                <h3>Thanh Toán</h3>
                <div className="payment-details">
                    <p>Tổng tiền:</p>
                    <p className="total-amount">{totalAmount.toLocaleString()} đ</p>
                </div>
                <button className="checkout-button" disabled={totalAmount === 0}>THANH TOÁN</button>
            </div>
        </div>
    );
};

export default ShoppingCart;
