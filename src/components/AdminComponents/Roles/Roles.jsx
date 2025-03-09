import React, { useState, useEffect } from 'react';
import './Roles.scss';
import DataTable from '../DataTable/DataTable';
import { getAllRoles, createRole, deleteRole, updateRole } from '../../../services/roleService';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const columns = [
  { field: 'roleId', headerName: 'ID', width: 70, type: 'number' },
  { field: 'roleName', headerName: 'Tên vai trò', width: 150, type: 'string' },
  {
    field: 'createdDate',
    headerName: 'Ngày tạo',
    width: 200,
    type: 'dateTime',
  },
  {
    field: 'lastEdited',
    headerName: 'Chỉnh sửa gần đây',
    width: 200,
    type: 'dateTime',
  },
  {
    field: 'status',
    headerName: 'Trạng thái',
    width: 100,
    type: 'number',
  },
];

const Roles = () => {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState({ roleName: '', status: 1 });
  const [selectedRole, setSelectedRole] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      const data = await getAllRoles();
      if (data && data.length > 0) {
        const formattedRoles = data.map((role) => ({
          id: role.roleId,
          roleId: role.roleId,
          roleName: role.roleName,
          createdDate: new Date(role.createdDate),
          lastEdited: new Date(role.lastEdited),
          status: role.status,
        }));
        setRoles(formattedRoles);
      }
      setLoading(false);
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing && selectedRole) {
      const response = await updateRole(selectedRole.roleId, {
        roleName: newRole.roleName,
        status: parseInt(newRole.status, 10),
      });
      if (response) {
        setRoles(
          roles.map((role) =>
            role.roleId === selectedRole.roleId
              ? { ...role, roleName: response.roleName, status: response.status }
              : role
          )
        );
      }
    } else {
      const response = await createRole({
        roleName: newRole.roleName,
        status: parseInt(newRole.status, 10),
      });
      if (response) {
        setRoles([
          ...roles,
          {
            id: response.roleId,
            roleId: response.roleId,
            roleName: response.roleName,
            createdDate: new Date(response.createdDate),
            lastEdited: new Date(response.lastEdited),
            status: response.status,
          },
        ]);
      }
    }
    setOpen(false);
    setIsEditing(false);
    setNewRole({ roleName: '', status: 1 });
  };
  

  const actionColumn = {
    field: "action",
    headerName: "Hành động",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="action">
          <div
            className="edit"
            onClick={() => {
              setSelectedRole(params.row);
              setNewRole({
                roleName: params.row.roleName,
                status: params.row.status,
              });
              setIsEditing(true);
              setOpen(true);
            }}
          >
          <img src="/edit.svg" alt="Edit" />
        </div>
          <div
            className="delete"
            onClick={() => {
              setSelectedRole(params.row);
              setConfirmDelete(true);
            }}
          >
            <img src="/delete.svg" alt="Delete" />
          </div>
        </div>
      );
    },
  };
  
  const handleDelete = async () => {
    if (selectedRole) {
      await deleteRole(selectedRole.roleId);
      setRoles(roles.filter((role) => role.roleId !== selectedRole.roleId));
      setConfirmDelete(false);
      setSelectedRole(null); // Reset lại sau khi xóa
    }
  };
  
  const handleCloseConfirm = () => {
    setConfirmDelete(false);
    setSelectedRole(null); // Reset lại khi đóng confirm
  };
  

  return (
    <div className='roles'>
      <div className='info'>
        <h1>Roles</h1>
        <button onClick={() => setOpen(true)}>Add New Role</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        // <DataTable slug='roles' columns={columns} rows={roles} />
        <div className="dataTable">
              <DataGrid
                className="dataGrid"
                rows={roles}
                columns={[...columns, actionColumn]}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnFilter
                disableDensitySelector
                disableColumnSelector
              />
        </div>
      )}

      {open && (
        <div className="add">
          <div className="modal">
            <span
              className="close"
              onClick={() => {
                setOpen(false);
                setIsEditing(false);
                setNewRole({ roleName: '', status: 1 });
              }}
            >
              X
            </span>
            <h1>{isEditing ? "Edit Role" : "Add New Role"}</h1>
            <form onSubmit={handleSubmit}>
              <div className="item">
                <label>Role Name</label>
                <input
                  type="text"
                  value={newRole.roleName}
                  onChange={(e) =>
                    setNewRole({ ...newRole, roleName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="item">
                <label>Status</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  value={newRole.status}
                  onChange={(e) =>
                    setNewRole({ ...newRole, status: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit">{isEditing ? "Update" : "Add"}</button>
            </form>
          </div>
        </div>
      )}


      {confirmDelete && (
        <div className='add'>
          <div className='modal'>
            <span className='close' onClick={() => setConfirmDelete(false)}>X</span>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete <strong>{selectedRole?.roleName}</strong>?</p>
            <div className="actions">
              <button className="cancel" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
              <button className="delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
