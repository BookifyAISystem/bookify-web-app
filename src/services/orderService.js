import api from "./apiService";

const ORDER_ENDPOINT = "/order";

export const getAllOrders = async () => {
    try {
        const response = await api.get(ORDER_ENDPOINT);
        return response.data || [];
    } catch {
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
        const response = await api.put(`${ORDER_ENDPOINT}/${id}/status`, { status });
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

export const getOrderByAccount = async (accountId) => {
    try {
        const response = await api.get(`${ORDER_ENDPOINT}?accountId=${accountId}`);
        const orders = response.data || [];

        if (!orders.length) return null;

        return orders.find(order => order.status === 1) || null;
    } catch {
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
