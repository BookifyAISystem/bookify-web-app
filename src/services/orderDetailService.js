import api from "./apiService";

const ORDER_DETAIL_ENDPOINT = "/order-details";

export const getAllOrderDetails = async () => {
    try {
        const response = await api.get(ORDER_DETAIL_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error("Error when fetching all order details:", error);
        //throw error;
        return null;
    }
};

export const getOrderDetailById = async (id) => {
    try {
        const response = await api.get(`${ORDER_DETAIL_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting OrderDetail with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createOrderDetail = async (orderDetail) => {
    try {
        const response = await api.post(ORDER_DETAIL_ENDPOINT, orderDetail);
        return response.data;
    } catch (error) {
        console.error("Error when creating an order detail:", error);
        //throw error;
        return null;
    }
};

export const updateOrderDetail = async (id, orderDetail) => {
    try {
        const response = await api.put(`${ORDER_DETAIL_ENDPOINT}/${id}`, orderDetail);
        return response.data;
    } catch (error) {
        console.error(`Error when updating OrderDetail with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteOrderDetail = async (id) => {
    try {
        const response = await api.delete(`${ORDER_DETAIL_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting OrderDetail with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${ORDER_DETAIL_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of OrderDetail with id ${id}:`, error);
        //throw error;
        return null;
    }
};