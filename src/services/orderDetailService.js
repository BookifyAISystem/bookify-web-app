import api from "./apiService";

const ORDER_DETAIL_ENDPOINT = "/order-detail";

// ✅ Lấy tất cả chi tiết đơn hàng
export const getAllOrderDetails = async () => {
    try {
        const response = await api.get(ORDER_DETAIL_ENDPOINT);
        return response.data || [];
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách OrderDetails:", error);
        return [];
    }
};

// ✅ Lấy chi tiết đơn hàng theo orderDetailId (nếu API hỗ trợ)
export const getOrderDetailById = async (id) => {
    try {
        const response = await api.get(`${ORDER_DETAIL_ENDPOINT}/${id}`);
        return response.data || null;
    } catch (error) {
        console.error(`❌ Lỗi khi lấy OrderDetail với id ${id}:`, error);
        return null;
    }
};

// ✅ Lấy danh sách sản phẩm trong đơn hàng (fix lỗi 404)
export const getOrderDetailsByOrderId = async (orderId) => {
    try {
        // 🚀 Kiểm tra đường dẫn API chính xác với backend
        const response = await api.get(`/order-detail?orderId=${orderId}`); 

        return response.data || []; 
    } catch (error) {
        console.error(`❌ Lỗi khi lấy OrderDetails theo orderId ${orderId}:`, error);
        return [];
    }
};


// ✅ Thêm sản phẩm vào đơn hàng (nếu chưa có)
export const createOrderDetail = async (orderDetail) => {
    try {
        const response = await api.post(ORDER_DETAIL_ENDPOINT, orderDetail);
        return response.data || null;
    } catch (error) {
        console.error("❌ Lỗi khi tạo OrderDetail:", error);
        return null;
    }
};

// ✅ Cập nhật số lượng sản phẩm
export const updateOrderDetail = async (id, orderDetail) => {
    try {
        console.log(`📤 Gửi request cập nhật số lượng: /order-detail/${id}`, orderDetail);

        const response = await api.put(`${ORDER_DETAIL_ENDPOINT}/${id}`, orderDetail);

        if (response.status === 204) {
            console.log("✅ Cập nhật thành công (204 No Content)");
            return true;
        } else if (response.data) {
            console.log("✅ API trả về:", response.data);
            return response.data;
        } else {
            console.error("❌ API phản hồi nhưng không có dữ liệu.");
            return null;
        }
    } catch (error) {
        console.error(`❌ Lỗi khi cập nhật OrderDetail với id ${id}:`, error);
        return null;
    }
};

// ✅ Xóa sản phẩm khỏi giỏ hàng
export const deleteOrderDetail = async (id) => {
    try {
        const response = await api.delete(`${ORDER_DETAIL_ENDPOINT}/${id}`);
        return response.data || null;
    } catch (error) {
        console.error(`❌ Lỗi khi xóa OrderDetail với id ${id}:`, error);
        return null;
    }
};

// ✅ Thay đổi trạng thái sản phẩm trong giỏ hàng
export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${ORDER_DETAIL_ENDPOINT}/${id}/status`, { status });
        return response.data || null;
    } catch (error) {
        console.error(`❌ Lỗi khi đổi trạng thái OrderDetail với id ${id}:`, error);
        return null;
    }
};
