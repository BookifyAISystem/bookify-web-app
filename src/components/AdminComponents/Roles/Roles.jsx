import React, { useState, useEffect } from 'react';
import './Roles.scss';
import DataTable from '../DataTable/DataTable';
import Add from '../Add/Add';
import { getAllRoles } from '../../../services/roleService';

// Định nghĩa các cột của bảng
const columns = [
  { field: 'roleId', headerName: 'ID', width: 70, type: 'number' },
  { field: 'roleName', headerName: 'Role name', width: 150, type: 'string' },
  {
    field: 'createdDate',
    headerName: 'Created date',
    width: 200,
    type: 'dateTime', // Sử dụng dateTime
  },
  {
    field: 'lastEdited',
    headerName: 'Last edited',
    width: 200,
    type: 'dateTime', // Sử dụng dateTime
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    type: 'boolean', // Hiển thị true/false dưới dạng biểu tượng
  },
];

const Roles = () => {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      const data = await getAllRoles();
      if (data && data.length > 0) {
        // Chuyển đổi dữ liệu từ API
        const formattedRoles = data.map((role) => ({
          id: role.roleId, // Dùng roleId làm ID
          roleId: role.roleId,
          roleName: role.roleName,
          createdDate: new Date(role.createdDate), // Chuyển đổi thành Date object
          lastEdited: new Date(role.lastEdited), // Chuyển đổi thành Date object
          status: role.status === 1, // Boolean true/false cho kiểu boolean
        }));
        setRoles(formattedRoles);
      }
      setLoading(false);
    };

    fetchRoles();
  }, []);

  return (
    <div className='roles'>
      <div className='info'>
        <h1>Roles</h1>
        <button onClick={() => setOpen(true)}>Add New Role</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable slug="roles" columns={columns} rows={roles} />
      )}

      {open && <Add slug="role" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Roles;
