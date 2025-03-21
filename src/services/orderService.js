import api from "./apiService";

const ORDER_ENDPOINT = "/orders";

export const getAllOrders = async () => {
    try {
        const response = await api.get(ORDER_ENDPOINT);
        return response.data || [];
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        return [];
    }
};

export const getOrderById = async (id) => {
    try {
        const response = await api.get(`${ORDER_ENDPOINT}/${id}`);
        return response.data || null;
    } catch {
        return null;
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await api.post(ORDER_ENDPOINT, orderData, {
            headers: { "Content-Type": "application/json" },
        });

        if (!response.data || !response.data.orderId) {
            return await getLatestOrderByAccount(orderData.accountId);
        }

        return response.data;
    } catch {
        return null;
    }
};

export const updateOrder = async (id, order) => {
    try {
        const response = await api.put(`${ORDER_ENDPOINT}/${id}`, order);
        return response.data || null;
    } catch {
        return null;
    }
};

export const deleteOrder = async (id) => {
    try {
        const response = await api.delete(`${ORDER_ENDPOINT}/${id}`);
        return response.data || null;
    } catch {
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.patch(`${ORDER_ENDPOINT}/change-status/${id}`, status);
        return response.data || null;
    } catch {
        return null;
    }
};

export const getLatestOrderByAccount = async (accountId) => {
    try {
        const response = await api.get(ORDER_ENDPOINT);
        const orders = response.data || [];

        if (!orders.length) return null;

        return orders
            .filter(order => order.accountId === accountId && order.status === 1)
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))[0] || null;
    } catch {
        return null;
    }
};

//lấy ra 1 đơn mới nhất
export const getOrderByAccount = async (accountId) => {
    try {
        const response = await api.get(`${ORDER_ENDPOINT}/account/${accountId}`);
        const orders = response.data || [];

        console.log("📦 Danh sách đơn hàng nhận từ API:", orders);

        if (!orders.length) return null;

        // Lấy đơn hàng mới nhất có status = 1
        const latestOrder = orders
            .filter(order => order.status === 1)
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))[0];

        console.log("✅ Đơn hàng hợp lệ mới nhất:", latestOrder);
        return latestOrder || null;
    } catch (error) {
        console.error(`❌ Lỗi khi lấy Order với accountId ${accountId}:`, error);
        return null;
    }
};

//lấy ra list đơn
export const getOrdersByAccount = async (accountId, status) => {
    try {
        const response = await api.get(`${ORDER_ENDPOINT}/account/${accountId}`);
        const orders = response.data || [];

        console.log("📦 Danh sách đơn hàng nhận từ API:", orders);

        if (!orders.length) return null;

        const filteredOrders = orders
            .filter(order => order.status === status)

        console.log("✅ Đơn hàng hợp lệ mới nhất:", filteredOrders);
        return filteredOrders || [];
    } catch (error) {
        console.error(`❌ Lỗi khi lấy Order với accountId ${accountId}:`, error);
        return null;
    }
};



export const getOrderDetailsByOrderId = async (orderId) => {
    try {
        const response = await api.get(`${ORDER_ENDPOINT}/${orderId}`);
        return response.data?.orderDetails || [];
    } catch {
        return [];
    }
};
