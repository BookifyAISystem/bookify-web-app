import React, { useState, useEffect } from "react";
import "./Users.scss";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getAllAccounts } from "../../../services/accountService";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "img",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => <img src={params.row.img || "/noavatar.png"} alt="" />,
  },
  { field: "displayName", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "createdDate", headerName: "Created Date", width: 150 },
  { field: "lastEdited", headerName: "Last Edited", width: 150 },
  { field: "roleId", headerName: "Role", width: 150 },
  { field: "status", headerName: "Status", width: 100 },
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllAccounts(page + 1, pageSize);
        console.log("API Response:", response); // Kiểm tra API có dữ liệu
        
        if (response?.items) {
          const mappedUsers = response.items.map(user => ({
            id: user.accountId, // Quan trọng: DataGrid cần trường "id"
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            phone: user.phone,
            createdDate: new Date(user.createdDate),
            lastEdited: new Date(user.lastEdited),
            status: user.status,
            roleId: user.roleId,
          }));
          
          console.log("Mapped Users:", mappedUsers); // Kiểm tra dữ liệu đã map đúng chưa
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
        <h1>Users</h1>
        <button onClick={() => setOpen(true)}>Add New User</button>
      </div>

      <div className="dataTable">
        <DataGrid
          className="dataGrid"
          rows={users}
          columns={[...columns, {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => (
              <div className="action">
                <Link to={`/admin/users/${params.row.id}`}>
                  <img src="/view.png" alt="View" />
                </Link>
                <div className="edit" onClick={() => console.log("Edit", params.row.id)}>
                  <img src="/edit.svg" alt="Edit" />
                </div>
                <div className="delete" onClick={() => console.log("Delete", params.row.id)}>
                  <img src="/delete.svg" alt="Delete" />
                </div>
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

      {open && <AddUser setOpen={setOpen} />}
    </div>
  );
};

const AddUser = ({ setOpen }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User added!");
    setOpen(false);
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => setOpen(false)}>X</span>
        <h1>Add new user</h1>
        <form onSubmit={handleSubmit}>
          {columns
            .filter(item => item.field !== "id" && item.field !== "img")
            .map((column, index) => (
              <div className="item" key={index}>
                <label>{column.headerName}</label>
                <input type={column.type || "text"} placeholder={column.field} />
              </div>
            ))}
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
};

AddUser.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default Users;
