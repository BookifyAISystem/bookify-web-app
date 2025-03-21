import React, { useState, useEffect } from 'react'
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { Link } from "react-router-dom"
import { getAllOrders } from '../../../services/orderService'
import { getAccountById } from '../../../services/accountService'
import './Orders.scss'
import { Chip } from '@mui/material'

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

  const fetchAccount = async (accountId) => {
    const account = await getAccountById(accountId);
    return account?.displayName || accountId;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const response = await getAllOrders()
        if (Array.isArray(response)) {
          const mappedOrders = await Promise.all(response.map(async (order) => ({
            id: order.orderId,
            createdDate: new Date(order.createdDate).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            status: order.status,
            total: order.total,
            accountId: await fetchAccount(order.accountId),
            voucherId: order.voucherId,
            orderDetails: order.orderDetails,
            cancelReason: order.cancelReason
          })))
          setOrders(mappedOrders)
        }
      } catch (error) {
        console.error('Lỗi khi tải đơn hàng:', error)
      }
      setLoading(false)
    }

    fetchOrders()
  }, [])

  return (
    <div className='orders'>
      <div className='info'>
        <h1>Quản lý Đơn hàng</h1>
      </div>

      <div className="dataTable">
        <DataGrid
          className="dataGrid"
          rows={orders}
          columns={[...columns, {
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
                  <Link to={`/admin/order/${params.row.id}`}>
                    <img src="/view.png" alt="Chi tiết" />
                  </Link>
                )}
                <div className="status" onClick={() => handleStatusChange(params.row.id)}>
                  <img src="/edit.svg" alt="Đổi trạng thái" />
                </div>
              </div>
            ),
          }]}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  )
}

export default Orders