import api from "./apiService";

const ORDER_ENDPOINT = "/order";

export const getAllOrders = async () => {
    try {
        const response = await api.get(ORDER_ENDPOINT);
        return response.data || [];
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
        return [];
    }
};

export const getOrderById = async (id) => {
    try {
        const response = await api.get(`${ORDER_ENDPOINT}/${id}`);
        return response.data || null;
    } catch (error) {
        console.error(`❌ Lỗi khi lấy Order với id ${id}:`, error);
        return null;
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await api.post(ORDER_ENDPOINT, orderData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Nếu API chỉ trả về `{ message: "Order created successfully" }`, cần fetch lại đơn hàng
        if (!response.data || !response.data.orderId) {
            console.warn("⚠️ API không trả về orderId, đang fetch lại đơn hàng...");
            return await getLatestOrderByAccount(orderData.accountId);
        }

        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi tạo đơn hàng:", error.response ? error.response.data : error.message);
        return null;
    }
};

export const updateOrder = async (id, order) => {
    try {
        const response = await api.put(`${ORDER_ENDPOINT}/${id}`, order);
        return response.data || null;
    } catch (error) {
        console.error(`❌ Lỗi khi cập nhật Order với id ${id}:`, error);
        return null;
    }
};

export const deleteOrder = async (id) => {
    try {
        const response = await api.delete(`${ORDER_ENDPOINT}/${id}`);
        return response.data || null;
    } catch (error) {
        console.error(`❌ Lỗi khi xóa Order với id ${id}:`, error);
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${ORDER_ENDPOINT}/${id}/status`, { status });
        return response.data || null;
    } catch (error) {
        console.error(`❌ Lỗi khi đổi trạng thái Order với id ${id}:`, error);
        return null;
    }
};

// ✅ Lấy đơn hàng mới nhất của user (dùng nếu API không hỗ trợ query theo accountId)
export const getLatestOrderByAccount = async (accountId) => {
    try {
        const response = await api.get(ORDER_ENDPOINT);
        const orders = response.data || [];

        if (!orders.length) {
            console.log("❌ Không tìm thấy đơn hàng nào.");
            return null;
        }

        // 🔥 Lọc đơn hàng của user và lấy đơn hàng mới nhất
        const latestOrder = orders
            .filter(order => order.accountId === accountId && order.status === 1)
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))[0];

        return latestOrder || null;
    } catch (error) {
        console.error(`❌ Lỗi khi lấy đơn hàng mới nhất của accountId ${accountId}:`, error);
        return null;
    }
};

// ✅ Lấy đơn hàng của tài khoản
export const getOrderByAccount = async (accountId) => {
    try {
        const response = await api.get(`${ORDER_ENDPOINT}?accountId=${accountId}`);
        const orders = response.data || [];

        if (!orders.length) {
            console.log("❌ Không có đơn hàng nào.");
            return null;
        }

        // 🔥 Lấy đơn hàng có trạng thái `status === 1`
        return orders.find(order => order.status === 1) || null;
    } catch (error) {
        console.error(`❌ Lỗi khi lấy Order theo accountId ${accountId}:`, error);
        return null;
    }
};

// ✅ Lấy danh sách sản phẩm trong đơn hàng
export const getOrderDetailsByOrderId = async (orderId) => {
    try {
        const response = await api.get(`${ORDER_ENDPOINT}/${orderId}`);
        return response.data?.orderDetails || []; // Trả về danh sách sản phẩm hoặc []
    } catch (error) {
        console.error(`❌ Lỗi khi lấy OrderDetails theo orderId ${orderId}:`, error);
        return [];
    }
};
