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
    // Xoá orderDetails nếu rỗng
    if (Array.isArray(orderData.orderDetails) && orderData.orderDetails.length === 0) {
      delete orderData.orderDetails;
    }

    console.log("📤 Gửi request tạo order với data:", orderData);

    const response = await api.post(ORDER_ENDPOINT, orderData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("📥 Response từ API createOrder:", response.data);

    if (!response.data || !response.data.orderId) {
      console.warn("⚠ API không trả về orderId, thử lấy đơn hàng gần nhất...");
      await new Promise(res => setTimeout(res, 200));
      const latestOrder = await getOrderByAccount(orderData.accountId);

      if (!latestOrder || latestOrder.status !== 1) {
        console.error("❌ Không có đơn hàng hợp lệ! API createOrder có vấn đề.");
        return null;
      }

      return latestOrder;
    }

    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error.response?.data || error.message);
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

// export const changeStatus1 = async (orderId, status = 2) => {
//   try {
//       const response = await api.put(`/orders/${orderId}`, {
//           status,
//           cancelReason: null
//       });

//       return response.data || null;
//   } catch (error) {
//       console.error(`❌ Lỗi cập nhật trạng thái đơn hàng ${orderId}:`, error.response?.data || error.message);
//       throw error;
//   }
// };

export const changeStatus = async (id, status) => {
    try {
        const response = await api.patch(`${ORDER_ENDPOINT}/${id}/change-status/`, status);
        return response.data || null;
    } catch {
        return null;
    }
};


export const getLatestOrderByAccount = async (accountId) => {
    try {
      const response = await api.get(`/api/v1/orders/account/${accountId}`);
      
      if (response.status === 404) {
        console.warn("⚠ API không tìm thấy đơn hàng nào.");
        return null;
      }
  
      const orders = response.data;
  
      if (!Array.isArray(orders)) {
        console.error("❌ API trả về dữ liệu không hợp lệ:", orders);
        return null;
      }
  
      // Chỉ lấy đơn hàng chưa thanh toán
      const validOrder = orders.find(order => order.status === 1);
      
      if (!validOrder) {
        console.warn("⚠ Không tìm thấy đơn hàng hợp lệ.");
        return null;
      }
  
      return validOrder;
    } catch (error) {
      console.error("❌ Lỗi khi lấy đơn hàng gần nhất:", error);
      return null;
    }
  };
  
  

  export const getOrderByAccount = async (accountId) => {
    try {
        const response = await api.get(`${ORDER_ENDPOINT}/account/${accountId}`);
        const orders = response.data || [];

        console.log("📦 Danh sách đơn hàng nhận từ API:", orders);

        if (!orders.length) return null;

        // 🔥 Lọc đơn hàng mới nhất có status = 1
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
export const updateOrderTotal = async (orderId, total) => {
    try {
      const response = await api.put(`${ORDER_ENDPOINT}/${orderId}`, { total });
      return response.data || null;
    } catch (error) {
      console.error(`❌ Lỗi khi cập nhật tổng tiền đơn hàng ${orderId}:`, error);
      return null;
    }
  };
  

export const getOrderWithDetails = async (orderId) => {
    try {
        const order = await getOrderById(orderId);
        if (!order) return null;

        // Get book details for each order detail
        const orderDetailsWithBooks = await Promise.all(
            order.orderDetails.map(async (detail) => {
                const bookResponse = await api.get(`/books/${detail.bookId}`);
                const book = bookResponse.data;
                return {
                    ...detail,
                    bookName: book.name,
                    bookImage: book.image,
                    author: book.author
                };
            })
        );

        return {
            ...order,
            orderDetails: orderDetailsWithBooks
        };
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        return null;
    }
};

export const getTotalRevenue = async () => {
    try {
        const response = await api.get(ORDER_ENDPOINT);
        const orders = response.data || [];
        
        const total = orders.reduce((sum, order) => {
            if (order.status === 3 || order.status === 4) {
                return sum + order.totalAmount;
            }
            return sum;
        }, 0);
        
        return total;
    } catch (error) {
        console.error("Error calculating total revenue:", error);
        return 0;
    }
};
