import api from "./apiService";

const ORDER_DETAIL_ENDPOINT = "/order-detail";

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
        const response = await api.get(`/order-detail?orderId=${orderId}`);
        return response.data || [];
    } catch {
        return [];
    }
};

export const createOrderDetail = async (orderDetail) => {
    try {
        const response = await api.post(ORDER_DETAIL_ENDPOINT, orderDetail);
        return response.data || null;
    } catch {
        return null;
    }
};

export const updateOrderDetail = async (id, orderDetail) => {
    try {
        const response = await api.put(`${ORDER_DETAIL_ENDPOINT}/${id}`, orderDetail);
        return response.status === 204 || response.data || null;
    } catch {
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
