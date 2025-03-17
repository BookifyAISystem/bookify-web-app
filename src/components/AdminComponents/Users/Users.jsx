import React, { useState, useEffect } from "react";
import "./Users.scss";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getAllAccounts, updateAccount } from "../../../services/accountService";
import { getRoleById } from "../../../services/roleService";

const columns = [
  { field: "id", headerName: "ID", width: 50 },
  {
    field: "img",
    headerName: "Avatar",
    width: 70,
    renderCell: (params) => <img src={params.row.img || "/noavatar.png"} alt="" />,
  },
  { field: "displayName", headerName: "Họ và Tên", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "phone", headerName: "SĐT", width: 100 },
  { field: "createdDate", headerName: "Ngày tạo", width: 150 },
  { field: "lastEdited", headerName: "Chỉnh sửa gần đây", width: 150 },
  { field: "roleId", headerName: "Vai trò", width: 100 },
  { field: "status", headerName: "Trạng thái", width: 100 },
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const getRole = async (roleId) => {
    const role = await getRoleById(roleId);
    return role?.roleName || roleId;
  };

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllAccounts(page + 1, pageSize);
      if (response?.items) {
        const mappedUsers = await Promise.all(
          response.items.map( async(user) => ({
            id: user.accountId,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            phone: user.phone,
            createdDate: new Date(user.createdDate),
            lastEdited: new Date(user.lastEdited),
            status: user.status,
            roleId: await getRole(user.roleId),
          }))
        );
        setUsers(mappedUsers);
        setTotalCount(response.totalCount);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllAccounts(page + 1, pageSize);
        if (response?.items) {
          const mappedUsers = await Promise.all(
            response.items.map(async (user) => ({
              id: user.accountId,
              username: user.username,
              displayName: user.displayName,
              email: user.email,
              phone: user.phone,
              createdDate: new Date(user.createdDate).toLocaleString(),
              lastEdited: new Date(user.lastEdited).toLocaleString(),
              status: user.status,
              roleId: await getRole(user.roleId),
            }))
          );
          
          setUsers(mappedUsers);
          setTotalCount(response.totalCount);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    };
    fetchUsers();
  }, [page, pageSize]);

  
  

  return (
    <div className="users">
      <div className="info">
        <h1>Người dùng</h1>
      </div>

      <div className="dataTable">
        <DataGrid
          className="dataGrid"
          rows={users}
          columns={[...columns, {
            field: "action",
            headerName: "Hành động",
            width: 150,
            renderCell: (params) => (
              <div className="action">
                <Link to={`/admin/users/${params.row.id}`}>
                  <img src="/view.png" alt="View" />
                </Link>
                <div
                    className="edit"
                    onClick={() => {
                      setSelectedUser(params.row);
                      setOpen(true);
                    }}
                >
                  <img src="/edit.svg" alt="Edit" />
                </div>
                {/* <div className="delete" onClick={() => console.log("Delete", params.row.id)}>
                  <img src="/delete.svg" alt="Delete" />
                </div> */}
              </div>
            ),
          }]}
          rowCount={totalCount}
          loading={loading}
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => setPageSize(newSize)}
          pageSizeOptions={[10, 20, 50]}
          slots={{ toolbar: GridToolbar }}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>

      {open && selectedUser && <AddUser user={selectedUser} setOpen={setOpen} refreshUsers={refreshUsers} />}
    </div>
  );
};

const AddUser = ({ user, setOpen, refreshUsers }) => {

  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        email: editedUser.email,
        phone: editedUser.phone,
        password: editedUser.password || "",
      };
  
      const response = await updateAccount(editedUser.id, updatedData);
      alert('Updated successfully');
      setOpen(false);
      await refreshUsers();
        
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };
  
  

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => setOpen(false)}>X</span>
        <h1>Edit user</h1>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>Username</label>
            <input type="text" placeholder="Username" value={editedUser.username} name="username" onChange={handleChange} disabled/>
          </div>
          <div className="item">
            <label>Email</label>
            <input type="email" placeholder="Email" value={editedUser.email} name="email" onChange={handleChange} />
          </div>
          <div className="item">
            <label>Phone</label>
            <input type="text" placeholder="Phone" value={editedUser.phone} name="phone" onChange={handleChange} />
          </div>
          
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

AddUser.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default Users;
