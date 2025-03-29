import React, { useState, useEffect } from 'react'
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { Link } from "react-router-dom"
import { getAllOrders, getOrderDetailsByOrderId } from '../../../services/orderService'
import { getAccountById } from '../../../services/accountService'
import { getBookById } from '../../../services/bookService'
import './Orders.scss'
import { Chip, Button } from '@mui/material'
import { Card, Table } from 'antd'

const statusConfig = {
  1: { color: 'default', text: '🛒 Trong giỏ hàng' },
  2: { color: 'primary', text: '📦 Đã đặt hàng' },
  3: { color: 'success', text: '✅ Đã hoàn thành' },
  4: { color: 'error', text: '❌ Đã hủy' }
};

const columns = [
  { field: "id", headerName: "Mã đơn hàng", width: 80 },
  { field: "createdDate", headerName: "Ngày tạo", width: 180 },
  { field: "status", headerName: "Trạng thái", width: 160, renderCell: (params) => (
    <Chip 
      label={statusConfig[params.value]?.text || `Unknown (${params.value})`}
      color={statusConfig[params.value]?.color || 'default'}
      variant="outlined"
      size="small"
    />
  ) },
  { field: "total", headerName: "Tổng tiền", width: 120 },
  { field: "accountId", headerName: "Tên khách hàng", width: 200 },
  { field: "voucherId", headerName: "Mã Voucher", width: 150 },
  { field: "cancelReason", headerName: "Lý do hủy", width: 200 }
]

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchAccount = async (accountId) => {
    const account = await getAccountById(accountId);
    return account?.displayName || accountId;
  }

  const handleCloseDetail = () => setSelectedOrder(null);

  const fetchOrderDetails = async (orderId) => {
    try {
      const details = await getOrderDetailsByOrderId(orderId);
      const detailsWithBookNames = await Promise.all(details.map(async (detail) => {
        const book = await getBookById(detail.bookId);
        return {
          ...detail,
          bookName: book ? book.bookName : 'Unknown Book'
        };
      }));
      setOrderDetails(detailsWithBookNames);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết đơn hàng:', error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const response = await getAllOrders()
        if (Array.isArray(response)) {
          const mappedOrders = await Promise.all(response.map(async (order) => ({
            id: order.orderId,
            createdDate: order.createdDate,
            status: order.status,
            total: order.total,
            accountId: await fetchAccount(order.accountId),
            voucherId: order.voucherId,
            orderDetails: order.orderDetails,
            cancelReason: order.cancelReason
          })))
          setOrders(mappedOrders)
          setTotalCount(response.length)
        }
      } catch (error) {
        console.error('Lỗi khi tải đơn hàng:', error)
      }
      setLoading(false)
    }

    fetchOrders()
  }, [])

  // Handle pagination changes
  const handlePaginationModelChange = (newModel) => {
    setPage(newModel.page);
    setPageSize(newModel.pageSize);
  };

  const renderOrderDetail = () => (
    <Card title={`Chi tiết đơn hàng #${selectedOrder.id}`}>
      <Table
        dataSource={orderDetails}
        columns={[
          { title: "Sản phẩm", dataIndex: "bookName", key: "bookName" },
          { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
          { title: "Thành tiền", dataIndex: "price", key: "price", render: (price, record) => `${(price * record.quantity).toLocaleString()} đ` },
        ]}
        rowKey="orderDetailId"
        pagination={false}
      />
      <Button className="back-button" onClick={handleCloseDetail}>
        Quay lại
      </Button>
    </Card>
  );

  return (
    <div className='orders'>
      <div className='info'>
        <h1>Quản lý Đơn hàng</h1>
      </div>

      <div className="dataTable">
        <DataGrid
          className="dataGrid"
          rows={orders}
          columns={[
            { field: "id", headerName: "Mã đơn hàng", width: 80 },
            { field: "createdDate", headerName: "Ngày tạo", width: 180 },
            { field: "status", headerName: "Trạng thái", width: 160 },
            { field: "total", headerName: "Tổng tiền", width: 120 },
            { field: "accountId", headerName: "Tên khách hàng", width: 200 },
            { field: "voucherId", headerName: "Mã Voucher", width: 150 },
            { field: "cancelReason", headerName: "Lý do hủy", width: 200 },
            {
              field: "action",
              headerName: "Thao tác",
              width: 120,
              renderCell: (params) => (
                <div className="action">
                  {params.row.status === 1 ? (
                    <div className="disabled-view" onClick={() => alert('Đơn hàng trong giỏ chưa được xác nhận!')}>
                      <img src="/view.png" alt="Chi tiết" style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                    </div>
                  ) : (
                    <div onClick={() => {
                      setSelectedOrder(params.row);
                      fetchOrderDetails(params.row.id);
                    }}>
                      <img src="/view.png" alt="Chi tiết" />
                    </div>
                  )}
                </div>
              ),
            }
          ]}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
          autoHeight
          pagination
          pageSizeOptions={[5, 10, 20, 50]}
          paginationModel={{ page, pageSize }}
          paginationMode="client"
          onPaginationModelChange={handlePaginationModelChange}
          rowCount={totalCount}
          getRowId={(row) => row.id}
          checkboxSelection
        />
      </div>

      {selectedOrder && (
        <div className="order-detail-modal">
          <div className="modal-content">
            {renderOrderDetail()}
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders