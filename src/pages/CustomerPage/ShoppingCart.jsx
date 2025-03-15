import React, { useState, useEffect } from "react";
import { getAllOrderDetails } from "../../services/orderDetailService";
import { getBookById } from "../../services/bookService";
import deleteIcon from "../../assets/icon/delete.svg";
import "./ShoppingCart.css";

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        const fetchCartData = async () => {
            const orderDetails = await getAllOrderDetails();

            if (orderDetails) {
                const validOrders = orderDetails.filter(order => order.status === 1);

                const itemsWithBookDetails = await Promise.all(
                    validOrders.map(async (order) => {
                        const book = await getBookById(order.bookId);
                        return book
                            ? {
                                id: order.orderDetailId,
                                bookId: order.bookId,
                                title: book.bookName,
                                image: book.bookImage,
                                price: order.price,
                                quantity: order.quantity,
                            }
                            : null;
                    })
                );
                setCartItems(itemsWithBookDetails.filter(item => item !== null));
            }
        };

        fetchCartData();
    }, []);

    // Cập nhật tổng tiền của các sản phẩm đã chọn
    const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Xử lý tích chọn sản phẩm
    const handleSelectItem = (item) => {
        let updatedSelectedItems;
    
        if (selectedItems.some(selected => selected.id === item.id)) {
            updatedSelectedItems = selectedItems.filter(selected => selected.id !== item.id);
        } else {
            updatedSelectedItems = [...selectedItems, item];
        }

        setSelectedItems(updatedSelectedItems);
    };

    // Xử lý chọn tất cả
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]); // Bỏ tích tất cả -> Tổng tiền về 0
        } else {
            setSelectedItems(cartItems.map(item => ({ ...item }))); // Tạo bản sao để cập nhật số lượng đúng
        }
        setSelectAll(!selectAll);
    };

    // Xử lý thay đổi số lượng sản phẩm
    const handleQuantityChange = (item, type) => {
        const updatedCart = cartItems.map(cartItem => {
            if (cartItem.id === item.id) {
                const newQuantity = type === "increase" ? cartItem.quantity + 1 : Math.max(1, cartItem.quantity - 1);
                return { ...cartItem, quantity: newQuantity };
            }
            return cartItem;
        });

        setCartItems(updatedCart);

        // Nếu sản phẩm đang được chọn, cập nhật lại số lượng trong `selectedItems`
        if (selectedItems.some(selected => selected.id === item.id)) {
            const updatedSelected = selectedItems.map(selected => {
                if (selected.id === item.id) {
                    const newQuantity = type === "increase" ? selected.quantity + 1 : Math.max(1, selected.quantity - 1);
                    return { ...selected, quantity: newQuantity };
                }
                return selected;
            });
            setSelectedItems(updatedSelected);
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
                        <div key={item.id} className="cart-item">
                            <div className="column checkbox-column">
                                <input 
                                    type="checkbox" 
                                    checked={selectedItems.some(selected => selected.id === item.id)}
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
                                <button className="delete-button">
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
