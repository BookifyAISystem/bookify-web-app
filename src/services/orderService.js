import api from "./apiService";

const ORDER_ENDPOINT = "/order";

export const getAllOrders = async () => {
    try {
        const response = await api.get("/order");
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
        return [];
    }
};


export const getOrderById = async (id) => {
    try {
        const response = await api.get(`${ORDER_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when getting Order with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await api.post(`/order`, orderData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi tạo đơn hàng:", error.response ? error.response.data : error.message);
        return null;
    }
};



export const updateOrder = async (id, order) => {
    try {
        const response = await api.put(`${ORDER_ENDPOINT}/${id}`, order);
        return response.data;
    } catch (error) {
        console.error(`Error when updating Order with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const deleteOrder = async (id) => {
    try {
        const response = await api.delete(`${ORDER_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error when deleting Order with id ${id}:`, error);
        //throw error;
        return null;
    }
};

export const changeStatus = async (id, status) => {
    try {
        const response = await api.put(`${ORDER_ENDPOINT}/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error when changing status of Order with id ${id}:`, error);
        //throw error;
        return null;
    }
};
export const getOrderByAccount = async (accountId) => {
    try {
        const response = await api.get(`${ORDER_ENDPOINT}`); // Lấy tất cả đơn hàng
        const orders = response.data;

        if (!orders || orders.length === 0) {
            console.log("❌ Không có đơn hàng nào.");
            return null;
        }

        // 🔥 Lọc ra đơn hàng thuộc về tài khoản đang đăng nhập
        const userOrder = orders.find(order => order.accountId === accountId);

        return userOrder || null;
    } catch (error) {
        console.error(`❌ Lỗi khi lấy Order theo accountId ${accountId}:`, error);
        return null;
    }
};


export const getOrderDetailsByOrderId = async (orderId) => {
    try {
        const response = await api.get(`${ORDER_ENDPOINT}/${orderId}`);
        return response.data.orderDetails || []; // Trả về danh sách sản phẩm trong giỏ hàng
    } catch (error) {
        console.error(`❌ Lỗi khi lấy OrderDetails theo orderId ${orderId}:`, error);
        return [];
    }
};


