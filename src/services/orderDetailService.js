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
        console.log(`📦 OrderDetails nhận được cho orderId ${orderId}:`, response.data);

        return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
        console.error(`❌ Lỗi khi lấy OrderDetails với orderId ${orderId}:`, error.response?.data || error.message);
        return [];
    }
};



export const createOrderDetail = async (orderDetail) => {
    try {
        console.log("📤 Gửi request tạo orderDetail với dữ liệu:", orderDetail);

        // 🔍 Kiểm tra nếu dữ liệu không hợp lệ thì báo lỗi
        if (!orderDetail || !orderDetail.orderId || !orderDetail.bookId || orderDetail.quantity <= 0 || orderDetail.price <= 0) {
            console.error("❌ Lỗi: Dữ liệu truyền vào không hợp lệ!", orderDetail);
            return null;
        }

        const response = await api.post(ORDER_DETAIL_ENDPOINT, orderDetail);
        console.log("✅ API createOrderDetail response:", response.data);
        return response.data || null;
    } catch (error) {
        console.error("❌ Lỗi khi gọi API createOrderDetail:", error);
        return null;
    }
};


export const updateOrderDetail = async (id, orderDetail) => {
    try {
        console.log(`📤 Gửi request cập nhật OrderDetail ID: ${id}`, orderDetail);

        // 🔍 Kiểm tra nếu dữ liệu không hợp lệ thì không gửi request
        if (!orderDetail || !orderDetail.orderId || !orderDetail.bookId || orderDetail.quantity <= 0 || orderDetail.price <= 0) {
            console.error("❌ Dữ liệu cập nhật không hợp lệ!", orderDetail);
            return null;
        }

        const response = await api.put(`${ORDER_DETAIL_ENDPOINT}/${id}`, orderDetail, {
            headers: { "Content-Type": "application/json" },
        });

        console.log(`✅ API updateOrderDetail response (${id}):`, response.data || response.status);
        return response.status === 204 || response.data || null;
    } catch (error) {
        console.error(`❌ Lỗi khi cập nhật OrderDetail với ID ${id}:`, error.response ? error.response.data : error);
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
