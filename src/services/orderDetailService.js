import api from "./apiService";

const ORDER_DETAIL_ENDPOINT = "orders/order-details";

export const getAllOrderDetails = async () => {
    try {
        const response = await api.get(ORDER_DETAIL_ENDPOINT);
        return response.data || [];
    } catch {
        return [];
    }
};

export const getOrderDetailById = async (id) => {
    try {
        const response = await api.get(`${ORDER_DETAIL_ENDPOINT}/${id}`);
        return response.data || null;
    } catch {
        return null;
    }
};

export const getOrderDetailsByOrderId = async (orderId) => {
    try {
        const response = await api.get(`${ORDER_DETAIL_ENDPOINT}?orderId=${orderId}`);
        
        if (!response.data) {
            console.warn(`⚠ Không có OrderDetails cho orderId ${orderId}`);
            return [];
        }

        return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
        console.error(`❌ Lỗi lấy OrderDetails orderId ${orderId}:`, error.response?.data || error.message);
        return [];
    }
};

export const createOrderDetail = async (orderDetail) => {
    try {
        if (!orderDetail || !orderDetail.orderId || !orderDetail.bookId || orderDetail.quantity <= 0 || orderDetail.price <= 0) {
            return null; // Bỏ qua log lỗi nếu dữ liệu không hợp lệ
        }

        const response = await api.post(ORDER_DETAIL_ENDPOINT, orderDetail);
        return response.data || null;
    } catch (error) {
        // Kiểm tra nếu là lỗi 500 thì không log ra console
        if (error.response?.status !== 500) {
            console.error("❌ Lỗi API createOrderDetail:", error.response?.data || error.message);
        }
        return null;
    }
};


export const updateOrderDetail = async (id, orderDetail) => {
    try {
        if (!orderDetail || !orderDetail.orderId || !orderDetail.bookId || orderDetail.quantity <= 0 || orderDetail.price <= 0) {
            console.error("❌ Dữ liệu cập nhật không hợp lệ!", orderDetail);
            return null;
        }

        const response = await api.put(`${ORDER_DETAIL_ENDPOINT}/${id}`, orderDetail, {
            headers: { "Content-Type": "application/json" },
        });

        return response.status === 204 || response.data || null;
    } catch (error) {
        console.error(`❌ Lỗi cập nhật OrderDetail ID ${id}:`, error.response?.data || error.message);
        return null;
    }
};

export const deleteOrderDetail = async (id) => {
    try {
        const response = await api.delete(`${ORDER_DETAIL_ENDPOINT}/${id}`);
        return response.data || null;
    } catch {
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${ORDER_DETAIL_ENDPOINT}/${id}/status`, { status });
        return response.data || null;
    } catch {
        return null;
    }
};
